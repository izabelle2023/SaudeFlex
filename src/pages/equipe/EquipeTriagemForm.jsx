import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { buscarPaciente, listarTriagens, registrarTriagem, atualizarStatusTriagem, PRIORIDADES } from '../../utils/api.js'
import '../paciente/PacienteCadastro.css'
import './EquipeTriagemForm.css'

export default function EquipeTriagemForm() {
  const { pacienteId } = useParams()
  const navigate = useNavigate()
  const paciente = buscarPaciente(pacienteId)
  const triagemPendente = listarTriagens()
    .filter((t) => t.pacienteId === pacienteId && t.status !== 'finalizado')
    .sort((a, b) => new Date(b.criadoEm) - new Date(a.criadoEm))[0]

  const [prioridade, setPrioridade] = useState('verde')
  const [sintomas, setSintomas] = useState(triagemPendente?.sintomas || '')
  const [observacoes, setObservacoes] = useState('')
  const [profissional, setProfissional] = useState('')
  const [vitais, setVitais] = useState({ pressao: '', temperatura: '', saturacao: '', frequencia: '' })
  const [erro, setErro] = useState('')

  if (!paciente) {
    return <p>Paciente não encontrado.</p>
  }

  function confirmar() {
    if (!sintomas.trim()) return setErro('Descreva os sintomas observados.')
    if (!profissional.trim()) return setErro('Informe o nome do profissional responsável.')

    if (triagemPendente) atualizarStatusTriagem(triagemPendente.id, 'finalizado')

    registrarTriagem({
      pacienteId: paciente.id,
      sintomas,
      prioridade,
      sinaisVitais: vitais,
      observacoes,
      profissional,
    })

    navigate('/equipe')
  }

  return (
    <div>
      <button className="btn-secundario" onClick={() => navigate('/equipe')} style={{ marginBottom: 20 }}>
        ← Voltar à fila
      </button>

      <div className="cadastro-card" style={{ maxWidth: 640 }}>
        <p className="cadastro-eyebrow">Classificação de risco</p>
        <h1>{paciente.nome}</h1>
        <p className="cadastro-sub">
          CPF {paciente.cpf} · Nascido em {paciente.nascimento ? new Date(paciente.nascimento).toLocaleDateString('pt-BR') : '—'}
        </p>

        <div className="cadastro-form">
          <label>
            Sintomas observados
            <textarea rows={2} value={sintomas} onChange={(e) => setSintomas(e.target.value)} />
          </label>

          <div>
            <p className="vitais-label">Classifique a prioridade</p>
            <div className="prioridade-opcoes">
              {Object.entries(PRIORIDADES).map(([key, info]) => (
                <button
                  key={key}
                  type="button"
                  className={`prioridade-opcao ${prioridade === key ? 'prioridade-opcao--ativa' : ''}`}
                  style={{ borderColor: prioridade === key ? info.cor : undefined, color: prioridade === key ? info.cor : undefined }}
                  onClick={() => setPrioridade(key)}
                >
                  {info.label}
                  <span className="prioridade-opcao-sla">{info.sla}</span>
                </button>
              ))}
            </div>
            <p className="prioridade-descricao">{PRIORIDADES[prioridade]?.descricao}</p>
          </div>

          <div className="cadastro-row">
            <label>
              Pressão arterial
              <input value={vitais.pressao} onChange={(e) => setVitais((v) => ({ ...v, pressao: e.target.value }))} placeholder="120/80" />
            </label>
            <label>
              Temperatura (°C)
              <input value={vitais.temperatura} onChange={(e) => setVitais((v) => ({ ...v, temperatura: e.target.value }))} placeholder="36.5" />
            </label>
          </div>
          <div className="cadastro-row">
            <label>
              Saturação O₂ (%)
              <input value={vitais.saturacao} onChange={(e) => setVitais((v) => ({ ...v, saturacao: e.target.value }))} placeholder="98" />
            </label>
            <label>
              Frequência cardíaca (bpm)
              <input value={vitais.frequencia} onChange={(e) => setVitais((v) => ({ ...v, frequencia: e.target.value }))} placeholder="72" />
            </label>
          </div>

          <label>
            Observações
            <textarea rows={2} value={observacoes} onChange={(e) => setObservacoes(e.target.value)} placeholder="Informações adicionais relevantes" />
          </label>

          <label>
            Profissional responsável
            <input value={profissional} onChange={(e) => setProfissional(e.target.value)} placeholder="Nome de quem está classificando" />
          </label>

          {erro && <p className="cadastro-erro">{erro}</p>}

          <button className="cadastro-btn" onClick={confirmar}>
            Confirmar classificação →
          </button>
        </div>
      </div>
    </div>
  )
}
