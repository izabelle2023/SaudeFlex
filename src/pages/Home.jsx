import { Link } from 'react-router-dom'
import './Home.css'

export default function Home() {
  return (
    <div className="home">
      <div className="home-glow" aria-hidden="true" />
      <header className="home-header">
        <div className="home-logo">
          <span className="home-logo-mark">+</span>
          Saudeflex
        </div>
      </header>

      <main className="home-main">
        <p className="home-eyebrow">Um gesto rápido de ter sua saúde de volta</p>
        <h1 className="home-title">
          Cuidado que se organiza<br />enquanto você é atendido.
        </h1>
        <p className="home-sub">
          Triagem por prioridade, agendamento sem conflitos e prontuário conectado —
          tudo em um só lugar, do primeiro sintoma à alta.
        </p>

        <div className="home-cards">
          <Link to="/paciente" className="home-card home-card--patient">
            <span className="home-card-tag">Sou paciente</span>
            <h2>Quero ser atendido</h2>
            <p>Faça seu cadastro e conte seus sintomas. Você entra na fila certa, na hora certa.</p>
            <span className="home-card-cta">Iniciar atendimento →</span>
          </Link>

          <Link to="/equipe" className="home-card home-card--staff">
            <span className="home-card-tag">Sou da equipe</span>
            <h2>Painel de triagem</h2>
            <p>Classifique pacientes, gerencie leitos, estoque e agenda em tempo real.</p>
            <span className="home-card-cta">Entrar no painel →</span>
          </Link>
        </div>
      </main>

      <footer className="home-footer">
        <span>🟣 Emergência</span>
        <span>🟠 Muito urgente</span>
        <span>🟡 Urgente</span>
        <span>🟢 Pouca urgência</span>
        <span>🔵 Não urgente</span>
      </footer>
    </div>
  )
}
