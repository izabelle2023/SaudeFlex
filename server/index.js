import express from 'express'
import fs from 'fs'
import path from 'path'
import cors from 'cors'
import bodyParser from 'body-parser'

const app = express()
app.use(cors())
app.use(bodyParser.json())

const DATA_FILE = path.resolve('./server/data.json')

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

const SEED_LEITOS = [
  { id: 'leito_1', setor: 'Emergência', numero: 'EME-01', ocupado: false, pacienteId: null },
  { id: 'leito_2', setor: 'Emergência', numero: 'EME-02', ocupado: false, pacienteId: null },
  { id: 'leito_3', setor: 'Clínica Geral', numero: 'CLI-01', ocupado: false, pacienteId: null },
  { id: 'leito_4', setor: 'Clínica Geral', numero: 'CLI-02', ocupado: false, pacienteId: null },
  { id: 'leito_5', setor: 'Pediatria', numero: 'PED-01', ocupado: false, pacienteId: null },
  { id: 'leito_6', setor: 'UTI', numero: 'UTI-01', ocupado: false, pacienteId: null },
]

function ensureData(data) {
  let changed = false
  if (!Array.isArray(data.pacientes)) { data.pacientes = []; changed = true }
  if (!Array.isArray(data.triagens)) { data.triagens = []; changed = true }
  if (!Array.isArray(data.agendamentos)) { data.agendamentos = []; changed = true }
  if (!Array.isArray(data.medicos) || data.medicos.length === 0) { data.medicos = SEED_MEDICOS; changed = true }
  if (!Array.isArray(data.estoque) || data.estoque.length === 0) { data.estoque = SEED_ESTOQUE; changed = true }
  if (!Array.isArray(data.leitos) || data.leitos.length === 0) { data.leitos = SEED_LEITOS; changed = true }
  if (!Array.isArray(data.historico)) { data.historico = []; changed = true }
  if (!Array.isArray(data.alertas)) { data.alertas = []; changed = true }
  if (changed) writeData(data)
  return data
}

function readData() {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'))
    return ensureData(data)
  } catch (e) {
    return ensureData({ pacientes: [], triagens: [], agendamentos: [], medicos: [], estoque: [], leitos: [], historico: [], alertas: [] })
  }
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8')
}

const SEED_LEITOS = [
  { id: 'leito_1', setor: 'Emergência', numero: 'EME-01', ocupado: false, pacienteId: null },
  { id: 'leito_2', setor: 'Emergência', numero: 'EME-02', ocupado: false, pacienteId: null },
  { id: 'leito_3', setor: 'Clínica Geral', numero: 'CLI-01', ocupado: false, pacienteId: null },
  { id: 'leito_4', setor: 'Clínica Geral', numero: 'CLI-02', ocupado: false, pacienteId: null },
  { id: 'leito_5', setor: 'Pediatria', numero: 'PED-01', ocupado: false, pacienteId: null },
  { id: 'leito_6', setor: 'UTI', numero: 'UTI-01', ocupado: false, pacienteId: null },
]

function ensureData(data) {
  let changed = false
  if (!Array.isArray(data.pacientes)) { data.pacientes = []; changed = true }
  if (!Array.isArray(data.triagens)) { data.triagens = []; changed = true }
  if (!Array.isArray(data.agendamentos)) { data.agendamentos = []; changed = true }
  if (!Array.isArray(data.medicos) || data.medicos.length === 0) { data.medicos = SEED_MEDICOS; changed = true }
  if (!Array.isArray(data.estoque) || data.estoque.length === 0) { data.estoque = SEED_ESTOQUE; changed = true }
  if (!Array.isArray(data.leitos) || data.leitos.length === 0) { data.leitos = SEED_LEITOS; changed = true }
  if (!Array.isArray(data.historico)) { data.historico = []; changed = true }
  if (!Array.isArray(data.alertas)) { data.alertas = []; changed = true }
  if (changed) writeData(data)
  return data
}

// Simple UID used by server
function uid(prefix = 'id') {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

app.get('/api/pacientes', (req, res) => {
  const data = readData()
  res.json(data.pacientes || [])
})

// buscar paciente por CPF
app.get('/api/pacientes/search', (req, res) => {
  const cpf = req.query.cpf
  const data = readData()
  if (!cpf) return res.status(400).json({ error: 'MISSING_CPF' })
  const norm = (s) => (s || '').toString().replace(/\D/g, '')
  const p = (data.pacientes || []).find((x) => norm(x.cpf) === norm(cpf))
  if (!p) return res.status(404).json({ error: 'NOT_FOUND' })
  res.json(p)
})

app.get('/api/pacientes/:id', (req, res) => {
  const data = readData()
  const p = (data.pacientes || []).find((x) => x.id === req.params.id)
  if (!p) return res.status(404).json({ error: 'NOT_FOUND' })
  res.json(p)
})

app.post('/api/pacientes', (req, res) => {
  const data = readData()
  const paciente = req.body
  if (paciente.id) {
    const idx = (data.pacientes || []).findIndex((p) => p.id === paciente.id)
    if (idx >= 0) {
      data.pacientes[idx] = { ...data.pacientes[idx], ...paciente }
      writeData(data)
      return res.json(data.pacientes[idx])
    }
  }
  const novo = { id: uid('pac'), criadoEm: new Date().toISOString(), ...paciente }
  data.pacientes.push(novo)
  writeData(data)
  res.json(novo)
})

app.get('/api/triagens', (req, res) => {
  const data = readData()
  res.json(data.triagens || [])
})

app.post('/api/triagens', (req, res) => {
  const data = readData()
  const novo = { id: uid('tri'), criadoEm: new Date().toISOString(), ...req.body }
  data.triagens.push(novo)
  writeData(data)
  res.json(novo)
})

app.get('/api/medicos', (req, res) => {
  const data = readData()
  res.json(data.medicos || [])
})

app.get('/api/estoque', (req, res) => {
  const data = readData()
  res.json(data.estoque || [])
})

app.post('/api/estoque', (req, res) => {
  const data = readData()
  const item = { id: uid('est'), ...req.body }
  data.estoque.push(item)
  writeData(data)
  res.json(item)
})

// Ajustar quantidade de um item de estoque
app.patch('/api/estoque/:id', (req, res) => {
  const data = readData()
  const idx = (data.estoque || []).findIndex((i) => i.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'NOT_FOUND' })
  const delta = Number(req.body.delta || 0)
  data.estoque[idx].quantidade = Math.max(0, (data.estoque[idx].quantidade || 0) + delta)
  writeData(data)
  // criar alerta se abaixo do minimo
  if (data.estoque[idx].quantidade < data.estoque[idx].minimo) {
    const alerta = { id: uid('alerta'), tipo: 'estoque_baixo', titulo: `Estoque baixo: ${data.estoque[idx].nome}`, detalhe: `Quantidade atual (${data.estoque[idx].quantidade}) abaixo do mínimo (${data.estoque[idx].minimo})`, lido: false, criadoEm: new Date().toISOString() }
    data.alertas = data.alertas || []
    data.alertas.push(alerta)
    writeData(data)
  }
  res.json(data.estoque[idx])
})

app.post('/api/agendamentos', (req, res) => {
  const data = readData()
  const { medicoId, dataHora } = req.body
  const conflito = (data.agendamentos || []).some(
    (a) => a.medicoId === medicoId && a.dataHora === dataHora && a.status !== 'cancelado'
  )
  if (conflito) return res.status(409).json({ erro: 'CONFLITO', mensagem: 'Já existe uma consulta marcada para este médico nesse horário.' })
  const ag = { id: uid('ag'), criadoEm: new Date().toISOString(), status: 'confirmado', ...req.body }
  data.agendamentos.push(ag)
  writeData(data)
  res.json(ag)
})

app.patch('/api/agendamentos/:id/cancelar', (req, res) => {
  const data = readData()
  const idx = (data.agendamentos || []).findIndex((a) => a.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'NOT_FOUND' })
  if (data.agendamentos[idx].status === 'cancelado') return res.json(data.agendamentos[idx])
  data.agendamentos[idx].status = 'cancelado'
  const pacienteId = data.agendamentos[idx].pacienteId
  if (pacienteId) {
    data.historico = data.historico || []
    data.historico.push({ id: uid('hist'), pacienteId, tipo: 'agendamento', descricao: 'Consulta cancelada.', dataHora: new Date().toISOString() })
  }
  writeData(data)
  res.json(data.agendamentos[idx])
})

app.get('/api/agendamentos', (req, res) => {
  const data = readData()
  res.json(data.agendamentos || [])
})

app.get('/api/alertas', (req, res) => {
  const data = readData()
  res.json(data.alertas || [])
})

app.post('/api/alertas', (req, res) => {
  const data = readData()
  const novo = { id: uid('alerta'), criadoEm: new Date().toISOString(), lido: false, ...req.body }
  data.alertas.push(novo)
  writeData(data)
  res.json(novo)
})

// marcar alerta como lido
app.patch('/api/alertas/:id/lido', (req, res) => {
  const data = readData()
  const idx = (data.alertas || []).findIndex((a) => a.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'NOT_FOUND' })
  data.alertas[idx].lido = true
  writeData(data)
  res.json(data.alertas[idx])
})

// Histórico
app.get('/api/historico', (req, res) => {
  const data = readData()
  const pacienteId = req.query.pacienteId
  const historico = data.historico || []
  if (pacienteId) return res.json(historico.filter((h) => h.pacienteId === pacienteId))
  res.json(historico)
})

// Leitos
app.get('/api/leitos', (req, res) => {
  const data = readData()
  res.json(data.leitos || [])
})

// criar leito (útil para testes)
app.post('/api/leitos', (req, res) => {
  const data = readData()
  const { setor, numero } = req.body
  const novo = { id: uid('leito'), setor: setor || 'Geral', numero: numero || `L-${Date.now() % 1000}`, ocupado: false, pacienteId: null }
  data.leitos = data.leitos || []
  data.leitos.push(novo)
  writeData(data)
  res.json(novo)
})

app.post('/api/leitos/ocupar', (req, res) => {
  const data = readData()
  const { leitoId, pacienteId } = req.body
  const idx = (data.leitos || []).findIndex((l) => l.id === leitoId)
  if (idx === -1) return res.status(404).json({ error: 'NOT_FOUND' })
  if (data.leitos[idx].ocupado) return res.status(409).json({ erro: 'OCUPADO', mensagem: 'Este leito já está ocupado.' })
  data.leitos[idx].ocupado = true
  data.leitos[idx].pacienteId = pacienteId
  data.leitos[idx].ocupadoEm = new Date().toISOString()
  // registrar historico
  data.historico = data.historico || []
  data.historico.push({ id: uid('hist'), pacienteId, tipo: 'internacao', descricao: `Internado no leito ${data.leitos[idx].numero} (${data.leitos[idx].setor}).`, dataHora: new Date().toISOString() })
  // alertar se setor esgotado
  const livres = (data.leitos || []).filter((l) => l.setor === data.leitos[idx].setor && !l.ocupado).length
  if (livres === 0) {
    data.alertas = data.alertas || []
    data.alertas.push({ id: uid('alerta'), tipo: 'leitos_esgotados', titulo: `Leitos esgotados: ${data.leitos[idx].setor}`, detalhe: `Não há mais leitos disponíveis no setor ${data.leitos[idx].setor}.`, lido: false, criadoEm: new Date().toISOString() })
  }
  writeData(data)
  res.json(data.leitos[idx])
})

app.post('/api/leitos/liberar', (req, res) => {
  const data = readData()
  const { leitoId } = req.body
  const idx = (data.leitos || []).findIndex((l) => l.id === leitoId)
  if (idx === -1) return res.status(404).json({ error: 'NOT_FOUND' })
  const pacienteId = data.leitos[idx].pacienteId
  data.leitos[idx].ocupado = false
  data.leitos[idx].pacienteId = null
  data.leitos[idx].ocupadoEm = null
  if (pacienteId) {
    data.historico = data.historico || []
    data.historico.push({ id: uid('hist'), pacienteId, tipo: 'alta', descricao: `Recebeu alta do leito ${data.leitos[idx].numero}.`, dataHora: new Date().toISOString() })
  }
  writeData(data)
  res.json(data.leitos[idx])
})

// atualizar status de triagem
app.patch('/api/triagens/:id/status', (req, res) => {
  const data = readData()
  const idx = (data.triagens || []).findIndex((t) => t.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'NOT_FOUND' })
  const status = req.body.status
  data.triagens[idx].status = status
  if (status === 'finalizado') data.triagens[idx].finalizadoEm = new Date().toISOString()
  if (status === 'finalizado') {
    data.historico = data.historico || []
    data.historico.push({ id: uid('hist'), pacienteId: data.triagens[idx].pacienteId, tipo: 'atendimento', descricao: 'Atendimento finalizado após triagem.', dataHora: new Date().toISOString() })
  }
  writeData(data)
  res.json(data.triagens[idx])
})

const port = process.env.PORT || 4000
app.listen(port, () => console.log(`Saudeflex server running on http://localhost:${port}`))
