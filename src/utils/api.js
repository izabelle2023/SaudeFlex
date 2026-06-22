import * as db from './db.js'

const BASE = typeof window !== 'undefined' ? (window.__SAUDEFLEX_API_BASE__ || '') : ''

async function apiFetch(path, options = {}) {
  if (!BASE) return null
  try {
    const res = await fetch(BASE + path, options)
    if (!res.ok) throw new Error('api_error')
    return await res.json()
  } catch (e) {
    return null
  }
}

export const PRIORIDADES = db.PRIORIDADES

// Pacientes
export function listarPacientes() {
  apiFetch('/api/pacientes').then(() => {})
  return db.listarPacientes()
}

export function buscarPaciente(id) {
  apiFetch(`/api/pacientes/${id}`).then(() => {})
  return db.buscarPaciente(id)
}

export function salvarPaciente(dados) {
  const local = db.salvarPaciente(dados)
  apiFetch('/api/pacientes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(local) }).then(() => {})
  return local
}

export function buscarPacientePorCPF(cpf) {
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
  return db.atualizarStatusTriagem(id, status)
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
  return db.cancelarAgendamento(id)
}

// Estoque
export function listarEstoque() {
  apiFetch('/api/estoque').then(() => {})
  return db.listarEstoque()
}

export function ajustarEstoque(itemId, delta) {
  const updated = db.ajustarEstoque(itemId, delta)
  // no reliable server endpoint for adjust; attempt to POST an alert if low
  if (updated && updated.quantidade < updated.minimo) {
    apiFetch('/api/alertas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tipo: 'estoque_baixo', titulo: `Estoque baixo: ${updated.nome}`, detalhe: `Quantidade atual: ${updated.quantidade}` }) })
  }
  return updated
}

export function adicionarItemEstoque(item) {
  const local = db.adicionarItemEstoque(item)
  apiFetch('/api/estoque', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(local) })
  return local
}

// Leitos
export function listarLeitos() {
  return db.listarLeitos()
}

export function ocuparLeito(leitoId, pacienteId) {
  const local = db.ocuparLeito(leitoId, pacienteId)
  return local
}

export function liberarLeito(leitoId) {
  const local = db.liberarLeito(leitoId)
  return local
}

// Historico / Prontuario
export function listarHistorico(pacienteId = null) {
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
  return db.marcarAlertaLido(id)
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
