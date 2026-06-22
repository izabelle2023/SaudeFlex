import { useState } from 'react'
import { listarAlertas, marcarAlertaLido, buscarPaciente } from '../../utils/api.js'
import './EquipeComum.css'
import './EquipeAlertas.css'

const ICONES = {
  paciente_critico: '🚑',
  estoque_baixo: '📦',
  leitos_esgotados: '🛏️',
}

export default function EquipeAlertas() {
  const [, setTick] = useState(0)
  const alertas = listarAlertas()
  const naoLidos = alertas.filter((a) => !a.lido)

  function marcarLido(id) {
    marcarAlertaLido(id)
    setTick((t) => t + 1)
  }

  return (
    <div>
      <div className="pagina-header">
        <div>
          <h1>Alertas do sistema</h1>
          <p className="pagina-sub">Avisos automáticos sobre estoque, leitos e pacientes críticos.</p>
        </div>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card" style={{ borderColor: naoLidos.length > 0 ? 'var(--color-emergencia)' : undefined }}>
          <div className="kpi-valor" style={{ color: naoLidos.length > 0 ? 'var(--color-emergencia)' : undefined }}>{naoLidos.length}</div>
          <div className="kpi-label">Não lidos</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-valor">{alertas.length}</div>
          <div className="kpi-label">Total registrado</div>
        </div>
      </div>

      {alertas.length === 0 ? (
        <div className="painel-cartao vazio-estado">
          <span className="vazio-estado-icon">🔔</span>
          <p>Nenhum alerta gerado ainda. O sistema avisa automaticamente quando algo precisa de atenção.</p>
        </div>
      ) : (
        <div className="alertas-lista">
          {alertas.map((a) => {
            const paciente = a.pacienteId ? buscarPaciente(a.pacienteId) : null
            return (
              <div key={a.id} className={`alerta-card ${a.lido ? 'alerta-card--lido' : ''}`}>
                <span className="alerta-icon">{ICONES[a.tipo] || '🔔'}</span>
                <div className="alerta-corpo">
                  <p className="alerta-titulo">{a.titulo}</p>
                  <p className="alerta-detalhe">{a.detalhe}</p>
                  {paciente && <p className="alerta-paciente">Paciente: {paciente.nome}</p>}
                  <p className="alerta-data">{new Date(a.criadoEm).toLocaleString('pt-BR')}</p>
                </div>
                {!a.lido && (
                  <button className="btn-secundario" onClick={() => marcarLido(a.id)}>Marcar como lido</button>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
