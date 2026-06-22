import { useState } from 'react'
import {
  listarPacientes,
  listarMedicos,
  listarAgendamentos,
  criarAgendamento,
  cancelarAgendamento,
} from '../../utils/db.js'
import './EquipeComum.css'
import './EquipeAgendamento.css'

export default function EquipeAgendamento() {
  const [tick, setTick] = useState(0)
  const pacientes = listarPacientes()
  const medicos = listarMedicos()
  const agendamentos = listarAgendamentos()
    .filter((a) => a.status !== 'cancelado')
    .sort((a, b) => new Date(a.dataHora) - new Date(b.dataHora))

  const [form, setForm] = useState({ pacienteId: '', medicoId: '', data: '', hora: '', motivo: '' })
  const [mensagem, setMensagem] = useState(null)

  function agendar(e) {
    e.preventDefault()
    if (!form.pacienteId || !form.medicoId || !form.data || !form.hora) {
      setMensagem({ tipo: 'erro', texto: 'Preencha paciente, médico, data e horário.' })
      return
    }
    const dataHora = `${form.data}T${form.hora}`
    const resultado = criarAgendamento({
      pacienteId: form.pacienteId,
      medicoId: form.medicoId,
      dataHora,
      motivo: form.motivo,
    })
    if (resultado.erro) {
      setMensagem({ tipo: 'erro', texto: resultado.mensagem })
      return
    }
    setMensagem({ tipo: 'ok', texto: 'Consulta agendada com sucesso.' })
    setForm({ pacienteId: '', medicoId: '', data: '', hora: '', motivo: '' })
    setTick((t) => t + 1)
  }

  function cancelar(id) {
    cancelarAgendamento(id)
    setTick((t) => t + 1)
  }

  return (
    <div>
      <div className="pagina-header">
        <div>
          <h1>Agendamento de consultas</h1>
          <p className="pagina-sub">O sistema impede automaticamente dois agendamentos para o mesmo médico no mesmo horário.</p>
        </div>
      </div>

      <div className="agendamento-grid">
        <form className="painel-cartao agendamento-form" onSubmit={agendar}>
          <h2 className="form-titulo">Nova consulta</h2>

          <label className="campo">
            Paciente
            <select value={form.pacienteId} onChange={(e) => setForm((f) => ({ ...f, pacienteId: e.target.value }))}>
              <option value="">Selecione</option>
              {pacientes.map((p) => (
                <option key={p.id} value={p.id}>{p.nome}</option>
              ))}
            </select>
          </label>

          <label className="campo">
            Médico
            <select value={form.medicoId} onChange={(e) => setForm((f) => ({ ...f, medicoId: e.target.value }))}>
              <option value="">Selecione</option>
              {medicos.map((m) => (
                <option key={m.id} value={m.id}>{m.nome} — {m.especialidade}</option>
              ))}
            </select>
          </label>

          <div className="campo-linha">
            <label className="campo">
              Data
              <input type="date" value={form.data} onChange={(e) => setForm((f) => ({ ...f, data: e.target.value }))} />
            </label>
            <label className="campo">
              Horário
              <input type="time" value={form.hora} onChange={(e) => setForm((f) => ({ ...f, hora: e.target.value }))} />
            </label>
          </div>

          <label className="campo">
            Motivo (opcional)
            <input value={form.motivo} onChange={(e) => setForm((f) => ({ ...f, motivo: e.target.value }))} placeholder="Retorno, exame, consulta de rotina..." />
          </label>

          {mensagem && (
            <p className={mensagem.tipo === 'erro' ? 'msg-erro' : 'msg-ok'}>{mensagem.texto}</p>
          )}

          <button type="submit" className="btn-primario" disabled={pacientes.length === 0}>
            Confirmar agendamento
          </button>
          {pacientes.length === 0 && (
            <p className="campo-aviso">Nenhum paciente cadastrado ainda. Cadastre um paciente primeiro.</p>
          )}
        </form>

        <div className="painel-cartao agendamento-lista">
          <h2 className="form-titulo">Próximas consultas</h2>
          {agendamentos.length === 0 ? (
            <p className="painel-vazio">Nenhuma consulta agendada.</p>
          ) : (
            <div className="lista-consultas">
              {agendamentos.map((a) => {
                const paciente = pacientes.find((p) => p.id === a.pacienteId)
                const medico = medicos.find((m) => m.id === a.medicoId)
                return (
                  <div key={a.id} className="consulta-item">
                    <div>
                      <p className="consulta-paciente">{paciente?.nome || 'Paciente removido'}</p>
                      <p className="consulta-medico">{medico?.nome} · {medico?.especialidade}</p>
                      <p className="consulta-data">{new Date(a.dataHora).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}</p>
                    </div>
                    <button className="btn-perigo" onClick={() => cancelar(a.id)}>Cancelar</button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
