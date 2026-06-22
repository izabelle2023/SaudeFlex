import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { buscarPaciente, registrarTriagem } from '../../utils/api.js'
import './PacienteCadastro.css'
import './PacienteTriagemInicial.css'

const SINTOMAS_COMUNS = [
  'Febre', 'Dor de cabeça', 'Dor no peito', 'Falta de ar',
  'Dor abdominal', 'Vômito', 'Tosse', 'Sangramento',
  'Tontura', 'Dor muscular', 'Alergia', 'Fratura ou trauma',
]

export default function PacienteTriagemInicial() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const pacienteId = params.get('pid')
  const paciente = pacienteId ? buscarPaciente(pacienteId) : null

  const [selecionados, setSelecionados] = useState([])
  const [descricao, setDescricao] = useState('')
  const [erro, setErro] = useState('')

  if (!paciente) {
    return (
      <div className="cadastro-card">
        <h1>Cadastro não encontrado</h1>
        <p className="cadastro-sub">
          Não conseguimos localizar seu cadastro. Volte e refaça o cadastro inicial.
        </p>
        <button className="cadastro-btn" onClick={() => navigate('/paciente')}>
          ← Voltar ao cadastro
        </button>
      </div>
    )
  }

  function alternarSintoma(sintoma) {
    setSelecionados((prev) =>
      prev.includes(sintoma) ? prev.filter((s) => s !== sintoma) : [...prev, sintoma]
    )
  }

  function enviar() {
    const partes = [...selecionados]
    if (descricao.trim()) partes.push(descricao.trim())
    if (partes.length === 0) {
      setErro('Selecione ao menos um sintoma ou descreva o que está sentindo.')
      return
    }

    // Entra na fila como "aguardando triagem profissional" — a prioridade real
    // (protocolo Manchester) será definida pela equipe na avaliação.
    registrarTriagem({
      pacienteId: paciente.id,
      sintomas: partes.join(', '),
      prioridade: 'verde',
      observacoes: 'Pré-triagem feita pelo próprio paciente. Aguardando avaliação profissional.',
      profissional: 'Autoatendimento',
    })

    navigate(`/paciente/painel/${paciente.id}`)
  }

  return (
    <div className="cadastro-card">
      <p className="cadastro-eyebrow">Passo 2 de 2</p>
      <h1>O que você está sentindo, {paciente.nome.split(' ')[0]}?</h1>
      <p className="cadastro-sub">
        Selecione os sintomas que se aplicam. Um profissional vai avaliar suas respostas
        e definir a prioridade do seu atendimento.
      </p>

      <div className="sintomas-grid">
        {SINTOMAS_COMUNS.map((s) => (
          <button
            key={s}
            type="button"
            className={`sintoma-chip ${selecionados.includes(s) ? 'sintoma-chip--ativo' : ''}`}
            onClick={() => alternarSintoma(s)}
          >
            {s}
          </button>
        ))}
      </div>

      <label className="cadastro-form" style={{ marginTop: 20 }}>
        Quer descrever com suas palavras? (opcional)
        <textarea
          rows={3}
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Ex: comecei a sentir dor forte no peito há 20 minutos..."
        />
      </label>

      {erro && <p className="cadastro-erro" style={{ marginTop: 16 }}>{erro}</p>}

      <div className="triagem-aviso">
        ⚠️ Se você está com dor no peito, falta de ar grave, sangramento intenso ou
        qualquer sinal de risco de vida, avise um profissional imediatamente — não
        espere a triagem pelo app.
      </div>

      <button className="cadastro-btn" style={{ marginTop: 20 }} onClick={enviar}>
        Entrar na fila de atendimento →
      </button>
    </div>
  )
}
