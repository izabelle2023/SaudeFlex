import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { salvarPaciente, buscarPacientePorCPF } from '../../utils/api.js'
import './PacienteCadastro.css'

function formatarCPF(value) {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  return digits
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}

export default function PacienteCadastro() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    nome: '',
    cpf: '',
    nascimento: '',
    telefone: '',
    convenio: '',
  })
  const [erro, setErro] = useState('')

  function atualizar(campo, valor) {
    setForm((f) => ({ ...f, [campo]: valor }))
    setErro('')
  }

  function continuar(e) {
    e.preventDefault()
    if (!form.nome.trim()) return setErro('Informe seu nome completo.')
    if (form.cpf.replace(/\D/g, '').length !== 11) return setErro('Informe um CPF válido (11 números).')
    if (!form.nascimento) return setErro('Informe sua data de nascimento.')

    const existente = buscarPacientePorCPF(form.cpf)
    const paciente = existente
      ? salvarPaciente({ ...existente, ...form })
      : salvarPaciente(form)

    navigate(`/paciente/triagem?pid=${paciente.id}`)
  }

  return (
    <div className="cadastro-card">
      <p className="cadastro-eyebrow">Passo 1 de 2</p>
      <h1>Vamos te conhecer</h1>
      <p className="cadastro-sub">
        Esses dados ajudam a equipe a te localizar no sistema e organizar seu atendimento.
      </p>

      <form onSubmit={continuar} className="cadastro-form">
        <label>
          Nome completo
          <input
            type="text"
            value={form.nome}
            onChange={(e) => atualizar('nome', e.target.value)}
            placeholder="Como está no seu documento"
            autoFocus
          />
        </label>

        <div className="cadastro-row">
          <label>
            CPF
            <input
              type="text"
              value={form.cpf}
              onChange={(e) => atualizar('cpf', formatarCPF(e.target.value))}
              placeholder="000.000.000-00"
              inputMode="numeric"
            />
          </label>
          <label>
            Data de nascimento
            <input
              type="date"
              value={form.nascimento}
              onChange={(e) => atualizar('nascimento', e.target.value)}
            />
          </label>
        </div>

        <div className="cadastro-row">
          <label>
            Telefone
            <input
              type="tel"
              value={form.telefone}
              onChange={(e) => atualizar('telefone', e.target.value)}
              placeholder="(00) 00000-0000"
            />
          </label>
          <label>
            Convênio (opcional)
            <input
              type="text"
              value={form.convenio}
              onChange={(e) => atualizar('convenio', e.target.value)}
              placeholder="Particular, se vazio"
            />
          </label>
        </div>

        {erro && <p className="cadastro-erro">{erro}</p>}

        <button type="submit" className="cadastro-btn">
          Continuar para a triagem →
        </button>
      </form>
    </div>
  )
}
