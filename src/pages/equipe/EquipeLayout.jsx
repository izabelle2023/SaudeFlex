import { Outlet, NavLink, Link } from 'react-router-dom'
import { alertasNaoLidos } from '../../utils/db.js'
import './EquipeLayout.css'

const NAV_ITEMS = [
  { to: '/equipe', label: 'Fila de Triagem', icon: '🚑', end: true },
  { to: '/equipe/agendamento', label: 'Agendamento', icon: '📅' },
  { to: '/equipe/leitos', label: 'Leitos', icon: '🛏️' },
  { to: '/equipe/estoque', label: 'Estoque', icon: '📦' },
  { to: '/equipe/prontuario', label: 'Prontuário', icon: '🧾' },
  { to: '/equipe/alertas', label: 'Alertas', icon: '🚨' },
]

export default function EquipeLayout() {
  const naoLidos = alertasNaoLidos().length

  return (
    <div className="equipe-shell">
      <aside className="equipe-sidebar">
        <Link to="/" className="equipe-logo">
          <span className="equipe-logo-mark">+</span>
          Saudeflex
        </Link>
        <nav className="equipe-nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `equipe-nav-item ${isActive ? 'equipe-nav-item--ativo' : ''}`}
            >
              <span className="equipe-nav-icon">{item.icon}</span>
              {item.label}
              {item.to === '/equipe/alertas' && naoLidos > 0 && (
                <span className="equipe-nav-badge">{naoLidos}</span>
              )}
            </NavLink>
          ))}
        </nav>
        <Link to="/" className="equipe-exit">← Voltar à tela inicial</Link>
      </aside>
      <main className="equipe-main">
        <Outlet />
      </main>
    </div>
  )
}
