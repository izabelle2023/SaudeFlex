import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  filaDeAtendimento,
  buscarPaciente,
  atualizarStatusTriagem,
  listarTriagens,
  PRIORIDADES,
} from '../../utils/db.js'
import PrioridadeBadge from '../../components/PrioridadeBadge.jsx'
import './EquipeComum.css'
import './EquipeFilaTriagem.css'

export default function EquipeFilaTriagem() {
  const [, setTick] = useState(0)
  useEffect(() => {
    const i = setInterval(() => setTick((t) => t + 1), 4000)
    return () => clearInterval(i)
  }, [])

  const fila = filaDeAtendimento()
  const todasTriagens = listarTriagens()
  const finalizadasHoje = todasTriagens.filter(
    (t) => t.status === 'finalizado' && isHoje(t.finalizadoEm)
  ).length
  const emergencias = fila.filter((t) => t.prioridade === 'vermelho' || t.prioridade === 'laranja').length

  function avancar(triagem) {
    const proximo = { aguardando: 'em_atendimento', em_atendimento: 'finalizado' }[triagem.status]
    if (proximo) atualizarStatusTriagem(triagem.id, proximo)
    setTick((t) => t + 1)
  }

  return (
    <div>
      <div className="pagina-header">
        <div>
          <h1>Fila de triagem</h1>
          <p className="pagina-sub">Pacientes ordenados automaticamente por prioridade clínica.</p>
        </div>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-valor">{fila.length}</div>
          <div className="kpi-label">Na fila agora</div>
        </div>
        <div className="kpi-card" style={{ borderColor: emergencias > 0 ? 'var(--color-emergencia)' : undefined }}>
          <div className="kpi-valor" style={{ color: emergencias > 0 ? 'var(--color-emergencia)' : undefined }}>{emergencias}</div>
          <div className="kpi-label">Vermelho/Laranja aguardando</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-valor">{finalizadasHoje}</div>
          <div className="kpi-label">Atendidos hoje</div>
        </div>
      </div>

      {fila.length === 0 ? (
        <div className="painel-cartao vazio-estado">
          <span className="vazio-estado-icon">✅</span>
          <p>Nenhum paciente na fila agora.</p>
        </div>
      ) : (
        <div className="fila-lista">
          {fila.map((triagem, index) => {
            const paciente = buscarPaciente(triagem.pacienteId)
            const cor = PRIORIDADES[triagem.prioridade]?.cor
            const isAuto = triagem.profissional === 'Autoatendimento'
            return (
              <div key={triagem.id} className="fila-card" style={{ borderLeftColor: cor }}>
                <div className="fila-posicao">{index + 1}º</div>
                <div className="fila-info">
                  <div className="fila-info-top">
                    <p className="fila-nome">{paciente?.nome || 'Paciente'}</p>
                    <PrioridadeBadge prioridade={triagem.prioridade} size="sm" />
                    {isAuto && <span className="fila-tag-auto">Pré-triagem do paciente</span>}
                  </div>
                  <p className="fila-sintomas">{triagem.sintomas}</p>
                  <p className="fila-meta">
                    Entrou {tempoDecorrido(triagem.criadoEm)} · Status: {traduzirStatus(triagem.status)}
                  </p>
                </div>
                <div className="fila-acoes">
                  {isAuto && (
                    <Link to={`/equipe/triagem/${paciente.id}`} className="btn-secundario">
                      Classificar
                    </Link>
                  )}
                  {!isAuto && (
                    <button className="btn-primario" onClick={() => avancar(triagem)}>
                      {triagem.status === 'aguardando' ? 'Chamar paciente' : 'Finalizar atendimento'}
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function isHoje(iso) {
  if (!iso) return false
  const d = new Date(iso)
  const hoje = new Date()
  return d.toDateString() === hoje.toDateString()
}

function tempoDecorrido(iso) {
  const min = Math.floor((Date.now() - new Date(iso).getTime()) / 60000)
  if (min < 1) return 'agora mesmo'
  if (min < 60) return `há ${min} min`
  const h = Math.floor(min / 60)
  return `há ${h}h${min % 60 ? ` ${min % 60}min` : ''}`
}

function traduzirStatus(status) {
  return { aguardando: 'Aguardando', em_atendimento: 'Em atendimento', finalizado: 'Finalizado' }[status] || status
}
