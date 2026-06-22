import { PRIORIDADES } from '../utils/db.js'
import './PrioridadeBadge.css'

export default function PrioridadeBadge({ prioridade, size = 'md' }) {
  const info = PRIORIDADES[prioridade]
  if (!info) return null
  return (
    <span
      className={`prioridade-badge prioridade-badge--${size}`}
      style={{
        background: `${info.cor}1A`,
        color: info.cor,
        border: `1px solid ${info.cor}40`,
      }}
    >
      <span className="prioridade-badge-dot" style={{ background: info.cor }} />
      {info.label}
    </span>
  )
}
