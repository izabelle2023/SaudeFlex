import { useState } from 'react'
import { listarPacientes, listarHistorico, listarTriagens, listarAgendamentos, listarMedicos } from '../../utils/api.js'
import PrioridadeBadge from '../../components/PrioridadeBadge.jsx'
import './EquipeComum.css'
import './EquipeProntuario.css'

export default function EquipeProntuario() {
  const [busca, setBusca] = useState('')
  const [selecionado, setSelecionado] = useState(null)
  const pacientes = listarPacientes()
  const medicos = listarMedicos()

  const filtrados = pacientes.filter((p) =>
    p.nome.toLowerCase().includes(busca.toLowerCase()) || p.cpf?.includes(busca)
  )

  const historico = selecionado ? listarHistorico(selecionado.id).sort((a, b) => new Date(b.dataHora) - new Date(a.dataHora)) : []
  const triagens = selecionado ? listarTriagens().filter((t) => t.pacienteId === selecionado.id) : []
  const consultas = selecionado ? listarAgendamentos().filter((a) => a.pacienteId === selecionado.id) : []

  return (
    <div>
      <div className="pagina-header">
        <div>
          <h1>Prontuário eletrônico</h1>
          <p className="pagina-sub">Busque um paciente para ver o histórico clínico completo.</p>
        </div>
      </div>

      <div className="prontuario-grid">
        <div className="painel-cartao prontuario-lista">
          <input
            className="busca-input"
            placeholder="Buscar por nome ou CPF..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          {filtrados.length === 0 ? (
            <p className="painel-vazio" style={{ marginTop: 16 }}>Nenhum paciente encontrado.</p>
          ) : (
            <div className="lista-pacientes">
              {filtrados.map((p) => (
                <button
                  key={p.id}
                  className={`paciente-linha ${selecionado?.id === p.id ? 'paciente-linha--ativo' : ''}`}
                  onClick={() => setSelecionado(p)}
                >
                  <span>{p.nome}</span>
                  <span className="paciente-linha-cpf">{p.cpf}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="painel-cartao prontuario-detalhe">
          {!selecionado ? (
            <div className="vazio-estado">
              <span className="vazio-estado-icon">🧾</span>
              <p>Selecione um paciente para visualizar o prontuário.</p>
            </div>
          ) : (
            <>
              <h2 className="prontuario-nome">{selecionado.nome}</h2>
              <p className="pagina-sub" style={{ marginBottom: 20 }}>
                CPF {selecionado.cpf} · Nascimento {selecionado.nascimento ? new Date(selecionado.nascimento).toLocaleDateString('pt-BR') : '—'} · {selecionado.convenio || 'Particular'}
              </p>

              {triagens.length > 0 && (
                <div className="prontuario-secao">
                  <h3>Triagens registradas</h3>
                  {triagens.map((t) => (
                    <div key={t.id} className="prontuario-item">
                      <div className="prontuario-item-top">
                        <PrioridadeBadge prioridade={t.prioridade} size="sm" />
                        <span className="prontuario-item-data">{new Date(t.criadoEm).toLocaleString('pt-BR')}</span>
                      </div>
                      <p>{t.sintomas}</p>
                      {t.observacoes && <p className="prontuario-item-obs">{t.observacoes}</p>}
                    </div>
                  ))}
                </div>
              )}

              {consultas.length > 0 && (
                <div className="prontuario-secao">
                  <h3>Consultas</h3>
                  {consultas.map((c) => {
                    const medico = medicos.find((m) => m.id === c.medicoId)
                    return (
                      <div key={c.id} className="prontuario-item">
                        <p>{medico?.nome} — {medico?.especialidade}</p>
                        <p className="prontuario-item-obs">
                          {new Date(c.dataHora).toLocaleString('pt-BR')} · {c.status}
                        </p>
                      </div>
                    )
                  })}
                </div>
              )}

              <div className="prontuario-secao">
                <h3>Linha do tempo</h3>
                {historico.length === 0 ? (
                  <p className="painel-vazio">Sem eventos registrados.</p>
                ) : (
                  <ul className="prontuario-timeline">
                    {historico.map((h) => (
                      <li key={h.id}>
                        <span className={`prontuario-timeline-dot prontuario-timeline-dot--${h.tipo}`} />
                        <div>
                          <p>{h.descricao}</p>
                          <span className="prontuario-item-data">{new Date(h.dataHora).toLocaleString('pt-BR')}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
