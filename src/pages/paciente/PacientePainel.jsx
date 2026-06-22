import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  buscarPaciente,
  listarTriagens,
  filaDeAtendimento,
  listarHistorico,
  listarAgendamentos,
  listarMedicos,
} from '../../utils/db.js'
import PrioridadeBadge from '../../components/PrioridadeBadge.jsx'
import './PacientePainel.css'

export default function PacientePainel() {
  const { pacienteId } = useParams()
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 3000)
    return () => clearInterval(interval)
  }, [])

  const paciente = buscarPaciente(pacienteId)
  const triagens = listarTriagens()
    .filter((t) => t.pacienteId === pacienteId)
    .sort((a, b) => new Date(b.criadoEm) - new Date(a.criadoEm))
  const triagemAtual = triagens.find((t) => t.status !== 'finalizado')
  const fila = filaDeAtendimento()
  const posicaoFila = triagemAtual ? fila.findIndex((t) => t.id === triagemAtual.id) + 1 : null
  const historico = listarHistorico(pacienteId).sort((a, b) => new Date(b.dataHora) - new Date(a.dataHora))
  const medicos = listarMedicos()
  const agendamentos = listarAgendamentos()
    .filter((a) => a.pacienteId === pacienteId && a.status !== 'cancelado')
    .sort((a, b) => new Date(a.dataHora) - new Date(b.dataHora))

  if (!paciente) {
    return (
      <div className="painel-card">
        <h1>Paciente não encontrado</h1>
        <Link to="/paciente" className="cadastro-btn" style={{ display: 'inline-block', marginTop: 16 }}>
          ← Voltar
        </Link>
      </div>
    )
  }

  return (
    <div className="painel-wrap">
      <div className="painel-card painel-status">
        <p className="cadastro-eyebrow">Olá, {paciente.nome.split(' ')[0]}</p>
        {triagemAtual ? (
          <>
            <div className="painel-status-top">
              <h1>Você está na fila</h1>
              <PrioridadeBadge prioridade={triagemAtual.prioridade} size="lg" />
            </div>
            <p className="painel-posicao">
              Posição atual: <strong>{posicaoFila}º</strong> na fila de atendimento
            </p>
            <p className="painel-status-detalhe">
              Status: <strong>{traduzirStatus(triagemAtual.status)}</strong>
              {triagemAtual.observacoes === 'Pré-triagem feita pelo próprio paciente. Aguardando avaliação profissional.' && (
                <span className="painel-status-nota"> — aguardando avaliação de um profissional para confirmar a prioridade.</span>
              )}
            </p>
            <p className="painel-sintomas"><strong>Sintomas relatados:</strong> {triagemAtual.sintomas}</p>
          </>
        ) : (
          <>
            <h1>Nenhum atendimento em andamento</h1>
            <p className="painel-status-detalhe">
              Você não está na fila agora. Se precisar de atendimento, inicie uma nova triagem.
            </p>
            <Link to={`/paciente/triagem?pid=${paciente.id}`} className="cadastro-btn" style={{ display: 'inline-block', marginTop: 14 }}>
              Iniciar nova triagem
            </Link>
          </>
        )}
      </div>

      {agendamentos.length > 0 && (
        <div className="painel-card">
          <h2 className="painel-section-title">Próximas consultas</h2>
          {agendamentos.map((a) => {
            const medico = medicos.find((m) => m.id === a.medicoId)
            return (
              <div key={a.id} className="painel-item">
                <div>
                  <p className="painel-item-title">{medico?.nome || 'Médico'}</p>
                  <p className="painel-item-sub">{medico?.especialidade}</p>
                </div>
                <p className="painel-item-data">{new Date(a.dataHora).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}</p>
              </div>
            )
          })}
        </div>
      )}

      <div className="painel-card">
        <h2 className="painel-section-title">Seu histórico</h2>
        {historico.length === 0 ? (
          <p className="painel-vazio">Ainda não há eventos registrados.</p>
        ) : (
          <ul className="painel-timeline">
            {historico.map((h) => (
              <li key={h.id}>
                <span className="painel-timeline-dot" />
                <div>
                  <p className="painel-timeline-desc">{h.descricao}</p>
                  <p className="painel-timeline-data">{new Date(h.dataHora).toLocaleString('pt-BR')}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

function traduzirStatus(status) {
  return { aguardando: 'Aguardando atendimento', em_atendimento: 'Em atendimento', finalizado: 'Finalizado' }[status] || status
}
