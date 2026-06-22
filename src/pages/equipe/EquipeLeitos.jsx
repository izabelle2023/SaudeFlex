import { useState } from 'react'
import { listarLeitos, listarPacientes, ocuparLeito, liberarLeito } from '../../utils/db.js'
import './EquipeComum.css'
import './EquipeLeitos.css'

export default function EquipeLeitos() {
  const [, setTick] = useState(0)
  const [modalLeito, setModalLeito] = useState(null)
  const leitos = listarLeitos()
  const pacientes = listarPacientes()

  const setores = [...new Set(leitos.map((l) => l.setor))]
  const ocupados = leitos.filter((l) => l.ocupado).length

  function abrirInternacao(leito) {
    setModalLeito(leito)
  }

  function confirmarInternacao(pacienteId) {
    if (!pacienteId) return
    ocuparLeito(modalLeito.id, pacienteId)
    setModalLeito(null)
    setTick((t) => t + 1)
  }

  function darAlta(leitoId) {
    liberarLeito(leitoId)
    setTick((t) => t + 1)
  }

  return (
    <div>
      <div className="pagina-header">
        <div>
          <h1>Gestão de leitos</h1>
          <p className="pagina-sub">Status em tempo real de ocupação por setor.</p>
        </div>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-valor">{leitos.length - ocupados}</div>
          <div className="kpi-label">Leitos disponíveis</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-valor">{ocupados}</div>
          <div className="kpi-label">Leitos ocupados</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-valor">{leitos.length}</div>
          <div className="kpi-label">Capacidade total</div>
        </div>
      </div>

      {setores.map((setor) => {
        const doSetor = leitos.filter((l) => l.setor === setor)
        const livres = doSetor.filter((l) => !l.ocupado).length
        return (
          <div key={setor} className="setor-bloco">
            <div className="setor-header">
              <h2>{setor}</h2>
              <span className={`setor-contagem ${livres === 0 ? 'setor-contagem--cheio' : ''}`}>
                {livres} de {doSetor.length} disponíveis
              </span>
            </div>
            <div className="leitos-grid">
              {doSetor.map((leito) => {
                const paciente = leito.pacienteId ? pacientes.find((p) => p.id === leito.pacienteId) : null
                return (
                  <div key={leito.id} className={`leito-card ${leito.ocupado ? 'leito-card--ocupado' : 'leito-card--livre'}`}>
                    <p className="leito-numero">{leito.numero}</p>
                    {leito.ocupado ? (
                      <>
                        <p className="leito-paciente">{paciente?.nome || 'Paciente'}</p>
                        <button className="btn-secundario leito-btn" onClick={() => darAlta(leito.id)}>Dar alta</button>
                      </>
                    ) : (
                      <button className="btn-primario leito-btn" onClick={() => abrirInternacao(leito)}>Internar</button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}

      {modalLeito && (
        <div className="modal-overlay" onClick={() => setModalLeito(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h2 className="form-titulo">Internar no leito {modalLeito.numero}</h2>
            {pacientes.length === 0 ? (
              <p className="painel-vazio">Nenhum paciente cadastrado.</p>
            ) : (
              <div className="lista-pacientes-modal">
                {pacientes.map((p) => (
                  <button key={p.id} className="paciente-modal-item" onClick={() => confirmarInternacao(p.id)}>
                    {p.nome}
                  </button>
                ))}
              </div>
            )}
            <button className="btn-secundario" style={{ marginTop: 16 }} onClick={() => setModalLeito(null)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  )
}
