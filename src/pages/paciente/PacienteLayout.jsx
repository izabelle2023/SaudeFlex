import { Outlet, Link } from 'react-router-dom'
import './PacienteLayout.css'

export default function PacienteLayout() {
  return (
    <div className="paciente-shell">
      <header className="paciente-header">
        <Link to="/" className="paciente-logo">
          <span className="paciente-logo-mark">+</span>
          Saudeflex
        </Link>
        <Link to="/" className="paciente-exit">Sair</Link>
      </header>
      <main className="paciente-main">
        <Outlet />
      </main>
    </div>
  )
}
