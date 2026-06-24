import * as db from './db.js'

const BASE = typeof window !== 'undefined' ? (window.__SAUDEFLEX_API_BASE__ || '') : ''

async function apiFetch(path, options = {}) {
  if (!BASE) return null
  try {
    const res = await fetch(BASE + path, options)
    if (!res.ok) return null
    return await res.json()
  } catch (e) {
    return null
  }
}

function normCpf(cpf) {
  return (cpf || '').toString().replace(/\D/g, '')
}

async function apiGet(path) {
  return await apiFetch(path)
}

async function apiPost(path, body) {
  return await apiFetch(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
}

async function apiPatch(path, body) {
  return await apiFetch(path, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
}

export const PRIORIDADES = db.PRIORIDADES

// Pacientes
export function listarPacientes() {
  apiFetch('/api/pacientes').then(() => {})
  return db.listarPacientes()
}

export function buscarPaciente(id) {
  apiGet(`/api/pacientes/${id}`).then((remote) => {
    if (remote) {
      db.salvarPaciente(remote)
    }
  })
  return db.buscarPaciente(id)
}

export function salvarPaciente(dados) {
  const local = db.salvarPaciente(dados)
  apiPost('/api/pacientes', local).then((remote) => {
    if (remote) db.salvarPaciente(remote)
  })
  return local
}

export function buscarPacientePorCPF(cpf) {
  apiGet(`/api/pacientes/search?cpf=${encodeURIComponent(cpf)}`).then((remote) => {
    if (remote) db.salvarPaciente(remote)
  })
  return db.buscarPacientePorCPF(cpf)
}

// Triagens
export function listarTriagens() {
  apiFetch('/api/triagens').then(() => {})
  return db.listarTriagens()
}

export function registrarTriagem(obj) {
  const local = db.registrarTriagem(obj)
  apiFetch('/api/triagens', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(local) }).then(() => {})
  return local
}

export function atualizarStatusTriagem(id, status) {
  const local = db.atualizarStatusTriagem(id, status)
  apiPatch(`/api/triagens/${id}/status`, { status }).then((remote) => {
    if (remote) db.atualizarStatusTriagem(id, remote.status)
  })
  return local
}

export function filaDeAtendimento() {
  return db.filaDeAtendimento()
}

// Agendamentos / Medicos
export function listarMedicos() {
  apiFetch('/api/medicos').then(() => {})
  return db.listarMedicos()
}

export function listarAgendamentos() {
  return db.listarAgendamentos()
}

export function criarAgendamento(obj) {
  const local = db.criarAgendamento(obj)
  apiFetch('/api/agendamentos', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(local) }).then(() => {})
  return local
}

export function cancelarAgendamento(id) {
  const local = db.cancelarAgendamento(id)
  apiPatch(`/api/agendamentos/${id}/cancelar`, {}).then((remote) => {
    if (remote) db.cancelarAgendamento(id)
  })
  return local
}

// Estoque
export function listarEstoque() {
  apiFetch('/api/estoque').then(() => {})
  return db.listarEstoque()
}

export function ajustarEstoque(itemId, delta) {
  const updated = db.ajustarEstoque(itemId, delta)
  apiPatch(`/api/estoque/${itemId}`, { delta }).then((remote) => {
    if (remote) {
      // keep local state in sync by re-applying if needed
      db.ajustarEstoque(itemId, remote.quantidade - (updated?.quantidade || 0))
    }
  })
  return updated
}

export function adicionarItemEstoque(item) {
  const local = db.adicionarItemEstoque(item)
  apiPost('/api/estoque', local).then((remote) => {
    if (remote) db.adicionarItemEstoque(remote)
  })
  return local
}

// Leitos
export function listarLeitos() {
  apiGet('/api/leitos').then(() => {})
  return db.listarLeitos()
}

export function ocuparLeito(leitoId, pacienteId) {
  const local = db.ocuparLeito(leitoId, pacienteId)
  apiPost('/api/leitos/ocupar', { leitoId, pacienteId }).then((remote) => {
    if (remote) {
      db.ocuparLeito(leitoId, pacienteId)
    }
  })
  return local
}

export function liberarLeito(leitoId) {
  const local = db.liberarLeito(leitoId)
  apiPost('/api/leitos/liberar', { leitoId }).then((remote) => {
    if (remote) db.liberarLeito(leitoId)
  })
  return local
}

// Historico / Prontuario
export function listarHistorico(pacienteId = null) {
  apiGet(`/api/historico${pacienteId ? `?pacienteId=${encodeURIComponent(pacienteId)}` : ''}`).then((remote) => {
    if (remote && pacienteId) {
      // optional: keep local history in sync
      remote.forEach((item) => {
        if (!db.listarHistorico(pacienteId).find((h) => h.id === item.id)) {
          db.registrarHistorico(item.pacienteId, item.tipo, item.descricao)
        }
      })
    }
  })
  return db.listarHistorico(pacienteId)
}

// Alertas
export function listarAlertas() {
  apiFetch('/api/alertas').then(() => {})
  return db.listarAlertas()
}

export function alertasNaoLidos() {
  return db.alertasNaoLidos()
}

export function marcarAlertaLido(id) {
  const local = db.marcarAlertaLido(id)
  apiPatch(`/api/alertas/${id}/lido`, {}).then((remote) => {
    if (remote) db.marcarAlertaLido(id)
  })
  return local
}

export function criarAlerta(obj) {
  const local = db.criarAlerta(obj)
  apiFetch('/api/alertas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(local) }).then(() => {})
  return local
}

export function listarHistoricoLocal(pacienteId = null) {
  return db.listarHistorico(pacienteId)
}

export function listarPacientesLocal() {
  return db.listarPacientes()
}

export default {
  PRIORIDADES,
}
