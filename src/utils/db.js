// db.js — camada de persistência local (simula um banco de dados real)
// Tudo fica salvo no navegador via localStorage, então o sistema funciona
// 100% sozinho, sem precisar de servidor ou conexão externa.

const NS = 'saudeflex:v1:'

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(NS + key)
    if (raw === null) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

function write(key, value) {
  localStorage.setItem(NS + key, JSON.stringify(value))
}

export function uid(prefix = 'id') {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

export function nowISO() {
  return new Date().toISOString()
}

// ---------- Seeds (dados de demonstração na primeira execução) ----------

const SEED_MEDICOS = [
  { id: 'med_1', nome: 'Dr. Marcos Aurélio', especialidade: 'Clínica Geral' },
  { id: 'med_2', nome: 'Dra. Beatriz Coutinho', especialidade: 'Pediatria' },
  { id: 'med_3', nome: 'Dr. Henrique Sales', especialidade: 'Cardiologia' },
  { id: 'med_4', nome: 'Dra. Fernanda Lacerda', especialidade: 'Ortopedia' },
]

const SEED_ESTOQUE = [
  { id: 'est_1', nome: 'Dipirona 500mg', categoria: 'Medicamento', quantidade: 120, minimo: 50, unidade: 'comprimidos' },
  { id: 'est_2', nome: 'Soro Fisiológico 0,9%', categoria: 'Insumo', quantidade: 18, minimo: 30, unidade: 'frascos' },
  { id: 'est_3', nome: 'Luvas Descartáveis (P)', categoria: 'EPI', quantidade: 200, minimo: 100, unidade: 'unidades' },
  { id: 'est_4', nome: 'Máscaras Cirúrgicas', categoria: 'EPI', quantidade: 40, minimo: 80, unidade: 'unidades' },
  { id: 'est_5', nome: 'Seringas 10ml', categoria: 'Insumo', quantidade: 85, minimo: 60, unidade: 'unidades' },
  { id: 'est_6', nome: 'Atadura de Crepe', categoria: 'Insumo', quantidade: 25, minimo: 40, unidade: 'rolos' },
]

const SEED_LEITOS = (() => {
  const setores = [
    { setor: 'Emergência', total: 6 },
    { setor: 'Clínica Geral', total: 10 },
    { setor: 'Pediatria', total: 6 },
    { setor: 'UTI', total: 4 },
  ]
  const leitos = []
  setores.forEach(({ setor, total }) => {
    for (let i = 1; i <= total; i++) {
      leitos.push({
        id: uid('leito'),
        setor,
        numero: `${setor.slice(0, 3).toUpperCase()}-${String(i).padStart(2, '0')}`,
        ocupado: Math.random() < 0.4,
        pacienteId: null,
      })
    }
  })
  return leitos
})()

function seedIfEmpty() {
  if (read('seeded', false)) return
  write('pacientes', [])
  write('triagens', [])
  write('agendamentos', [])
  write('medicos', SEED_MEDICOS)
  write('estoque', SEED_ESTOQUE)
  write('leitos', SEED_LEITOS)
  write('historico', [])
  write('alertas', [])
  write('seeded', true)
}

seedIfEmpty()

// ---------- Pacientes ----------

export function listarPacientes() {
  return read('pacientes', [])
}

export function buscarPaciente(id) {
  return listarPacientes().find((p) => p.id === id) || null
}

function normCpf(cpf) {
  return (cpf || '').toString().replace(/\D/g, '')
}

export function buscarPacientePorCPF(cpf) {
  const target = normCpf(cpf)
  return listarPacientes().find((p) => normCpf(p.cpf) === target) || null
}

export function salvarPaciente(dados) {
  const pacientes = listarPacientes()
  if (dados.id) {
    const idx = pacientes.findIndex((p) => p.id === dados.id)
    if (idx >= 0) {
      pacientes[idx] = { ...pacientes[idx], ...dados }
      write('pacientes', pacientes)
      return pacientes[idx]
    }
  }
  const novo = { id: uid('pac'), criadoEm: nowISO(), ...dados }
  pacientes.push(novo)
  write('pacientes', pacientes)
  registrarHistorico(novo.id, 'cadastro', 'Paciente cadastrado no sistema.')
  return novo
}

// -- Sincronização simples com backend (quando disponível) --
async function apiFetch(path, options = {}) {
  const base = window.__SAUDEFLEX_API_BASE__ || ''
  try {
    const res = await fetch(base + path, options)
    if (!res.ok) throw new Error('api_error')
    return await res.json()
  } catch (e) {
    return null
  }
}

export async function syncSalvarPaciente(dados) {
  const saved = salvarPaciente(dados)
  // tenta enviar ao backend, ignora falhas
  apiFetch('/api/pacientes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(saved) })
  return saved
}

// ---------- Triagem ----------
// Prioridade segue o Protocolo de Manchester (5 níveis por cor):
// vermelho (emergência) > laranja (muito urgente) > amarelo (urgente) > verde (pouca urgência) > azul (não urgente)

export const PRIORIDADES = {
  vermelho: {
    label: 'Emergência',
    cor: '#8E2DE2',
    peso: 0,
    sla: 'Imediato',
    descricao: 'Risco imediato de morte ou perda de função de órgãos. Atendimento imediato.',
  },
  laranja: {
    label: 'Muito urgente',
    cor: '#E8531D',
    peso: 1,
    sla: 'até 10 min',
    descricao: 'Casos graves, com risco de agravamento rápido. Atendimento médico prioritário.',
  },
  amarelo: {
    label: 'Urgente',
    cor: '#E8A33D',
    peso: 2,
    sla: 'até 60 min',
    descricao: 'Gravidade moderada, exige atendimento rápido para evitar complicações.',
  },
  verde: {
    label: 'Pouca urgência',
    cor: '#3A8754',
    peso: 3,
    sla: 'até 2h',
    descricao: 'Casos leves, necessitam avaliação mas sem risco imediato.',
  },
  azul: {
    label: 'Não urgente',
    cor: '#2D6CDF',
    peso: 4,
    sla: 'até 4h',
    descricao: 'Casos simples, sem sintomas agudos. Pode ser atendido no hospital ou encaminhado a uma UBS.',
  },
}

export function listarTriagens() {
  return read('triagens', [])
}

// Fila ordenada: prioridade primeiro, depois quem chegou há mais tempo (FIFO) dentro da mesma prioridade
export function filaDeAtendimento() {
  const triagens = listarTriagens().filter((t) => t.status !== 'finalizado')
  return [...triagens].sort((a, b) => {
    const pa = PRIORIDADES[a.prioridade]?.peso ?? 9
    const pb = PRIORIDADES[b.prioridade]?.peso ?? 9
    if (pa !== pb) return pa - pb
    return new Date(a.criadoEm) - new Date(b.criadoEm)
  })
}

export function registrarTriagem({ pacienteId, sintomas, prioridade, sinaisVitais, observacoes, profissional }) {
  const triagens = listarTriagens()
  const nova = {
    id: uid('tri'),
    pacienteId,
    sintomas,
    prioridade, // 'vermelho' | 'laranja' | 'amarelo' | 'verde' | 'azul'
    sinaisVitais: sinaisVitais || {},
    observacoes: observacoes || '',
    profissional: profissional || 'Não informado',
    status: 'aguardando', // aguardando -> em_atendimento -> finalizado
    criadoEm: nowISO(),
  }
  triagens.push(nova)
  write('triagens', triagens)

  registrarHistorico(pacienteId, 'triagem', `Triagem registrada: ${PRIORIDADES[prioridade]?.label}. Sintomas: ${sintomas}`)

  if (prioridade === 'vermelho' || prioridade === 'laranja') {
    criarAlerta({
      tipo: 'paciente_critico',
      titulo: 'Paciente em estado crítico aguardando',
      detalhe: `Triagem classificada como Emergência. Sintomas: ${sintomas}`,
      pacienteId,
    })
  }

  return nova
}

export function atualizarStatusTriagem(triagemId, status) {
  const triagens = listarTriagens()
  const idx = triagens.findIndex((t) => t.id === triagemId)
  if (idx === -1) return null
  triagens[idx].status = status
  if (status === 'finalizado') triagens[idx].finalizadoEm = nowISO()
  write('triagens', triagens)
  if (status === 'finalizado') {
    registrarHistorico(triagens[idx].pacienteId, 'atendimento', 'Atendimento finalizado após triagem.')
  }
  return triagens[idx]
}

// ---------- Agendamento ----------

export function listarMedicos() {
  return read('medicos', [])
}

export function listarAgendamentos() {
  return read('agendamentos', [])
}

// Verifica se já existe agendamento para o mesmo médico no mesmo horário (conflito)
export function haConflito(medicoId, dataHoraISO, ignorarId = null) {
  const agendamentos = listarAgendamentos()
  return agendamentos.some(
    (a) =>
      a.id !== ignorarId &&
      a.medicoId === medicoId &&
      a.dataHora === dataHoraISO &&
      a.status !== 'cancelado'
  )
}

export function criarAgendamento({ pacienteId, medicoId, dataHora, motivo }) {
  if (haConflito(medicoId, dataHora)) {
    return { erro: 'CONFLITO', mensagem: 'Já existe uma consulta marcada para este médico nesse horário. Escolha outro horário.' }
  }
  const agendamentos = listarAgendamentos()
  const novo = {
    id: uid('ag'),
    pacienteId,
    medicoId,
    dataHora,
    motivo: motivo || '',
    status: 'confirmado',
    criadoEm: nowISO(),
  }
  agendamentos.push(novo)
  write('agendamentos', agendamentos)
  registrarHistorico(pacienteId, 'agendamento', `Consulta agendada para ${new Date(dataHora).toLocaleString('pt-BR')}.`)
  return novo
}

export function cancelarAgendamento(id) {
  const agendamentos = listarAgendamentos()
  const idx = agendamentos.findIndex((a) => a.id === id)
  if (idx === -1) return null
  agendamentos[idx].status = 'cancelado'
  write('agendamentos', agendamentos)
  registrarHistorico(agendamentos[idx].pacienteId, 'agendamento', 'Consulta cancelada.')
  return agendamentos[idx]
}

// ---------- Estoque ----------

export function listarEstoque() {
  return read('estoque', [])
}

export function itensAbaixoDoMinimo() {
  return listarEstoque().filter((i) => i.quantidade < i.minimo)
}

export function ajustarEstoque(itemId, delta) {
  const estoque = listarEstoque()
  const idx = estoque.findIndex((i) => i.id === itemId)
  if (idx === -1) return null
  estoque[idx].quantidade = Math.max(0, estoque[idx].quantidade + delta)
  write('estoque', estoque)

  if (estoque[idx].quantidade < estoque[idx].minimo) {
    criarAlerta({
      tipo: 'estoque_baixo',
      titulo: `Estoque baixo: ${estoque[idx].nome}`,
      detalhe: `Quantidade atual (${estoque[idx].quantidade}) está abaixo do mínimo recomendado (${estoque[idx].minimo}).`,
    })
  }
  return estoque[idx]
}

export function adicionarItemEstoque({ nome, categoria, quantidade, minimo, unidade }) {
  const estoque = listarEstoque()
  const novo = { id: uid('est'), nome, categoria, quantidade: Number(quantidade), minimo: Number(minimo), unidade }
  estoque.push(novo)
  write('estoque', estoque)
  return novo
}

// ---------- Leitos ----------

export function listarLeitos() {
  return read('leitos', [])
}

export function ocuparLeito(leitoId, pacienteId) {
  const leitos = listarLeitos()
  const idx = leitos.findIndex((l) => l.id === leitoId)
  if (idx === -1) return null
  if (leitos[idx].ocupado) {
    return { erro: 'OCUPADO', mensagem: 'Este leito já está ocupado.' }
  }
  leitos[idx].ocupado = true
  leitos[idx].pacienteId = pacienteId
  leitos[idx].ocupadoEm = nowISO()
  write('leitos', leitos)
  registrarHistorico(pacienteId, 'internacao', `Internado no leito ${leitos[idx].numero} (${leitos[idx].setor}).`)

  const livres = leitos.filter((l) => l.setor === leitos[idx].setor && !l.ocupado).length
  if (livres === 0) {
    criarAlerta({
      tipo: 'leitos_esgotados',
      titulo: `Leitos esgotados: ${leitos[idx].setor}`,
      detalhe: `Não há mais leitos disponíveis no setor ${leitos[idx].setor}.`,
    })
  }
  return leitos[idx]
}

export function liberarLeito(leitoId) {
  const leitos = listarLeitos()
  const idx = leitos.findIndex((l) => l.id === leitoId)
  if (idx === -1) return null
  const pacienteId = leitos[idx].pacienteId
  leitos[idx].ocupado = false
  leitos[idx].pacienteId = null
  leitos[idx].ocupadoEm = null
  write('leitos', leitos)
  if (pacienteId) registrarHistorico(pacienteId, 'alta', `Recebeu alta do leito ${leitos[idx].numero}.`)
  return leitos[idx]
}

// ---------- Histórico / Prontuário ----------

export function listarHistorico(pacienteId = null) {
  const historico = read('historico', [])
  if (!pacienteId) return historico
  return historico.filter((h) => h.pacienteId === pacienteId)
}

export function registrarHistorico(pacienteId, tipo, descricao) {
  const historico = read('historico', [])
  const evento = { id: uid('hist'), pacienteId, tipo, descricao, dataHora: nowISO() }
  historico.push(evento)
  write('historico', historico)
  return evento
}

// ---------- Alertas ----------

export function listarAlertas() {
  return read('alertas', []).sort((a, b) => new Date(b.criadoEm) - new Date(a.criadoEm))
}

export function criarAlerta({ tipo, titulo, detalhe, pacienteId = null }) {
  const alertas = read('alertas', [])
  const novo = { id: uid('alerta'), tipo, titulo, detalhe, pacienteId, lido: false, criadoEm: nowISO() }
  alertas.push(novo)
  write('alertas', alertas)
  return novo
}

export function marcarAlertaLido(id) {
  const alertas = read('alertas', [])
  const idx = alertas.findIndex((a) => a.id === id)
  if (idx === -1) return null
  alertas[idx].lido = true
  write('alertas', alertas)
  return alertas[idx]
}

export function alertasNaoLidos() {
  return listarAlertas().filter((a) => !a.lido)
}

// ---------- Reset (útil para demonstrações) ----------

export function resetarSistema() {
  Object.keys(localStorage)
    .filter((k) => k.startsWith(NS))
    .forEach((k) => localStorage.removeItem(k))
  seedIfEmpty()
}
