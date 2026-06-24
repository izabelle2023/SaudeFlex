import { Outlet, Link } from 'react-router-dom'
import './PacienteLayout.css'
import Logo from '../../components/Logo.jsx'

export default function PacienteLayout() {
  return (
    <div className="paciente-shell">
      <header className="paciente-header">
        <Link to="/" className="paciente-logo">
          <Logo compact />
        </Link>
        <Link to="/" className="paciente-exit">Sair</Link>
      </header>
      <main className="paciente-main">
        <Outlet />
      </main>
    </div>
  )
}
