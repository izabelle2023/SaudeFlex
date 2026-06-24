import './Logo.css'

export default function Logo({ compact = false }) {
  return (
    <span className={`logo${compact ? ' logo--compact' : ''}`}>
      <svg
        className="logo-icon"
        viewBox="0 0 64 64"
        role="img"
        aria-label="Logo Saudeflex"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M32 10c-3.3 0-6.3 1.6-8.2 4.2C21 10.3 17.1 8 12.5 8 6.7 8 2 12.7 2 18.5 2 31.2 32 52 32 52s30-20.8 30-33.5C62 12.7 57.3 8 51.5 8c-4.6 0-8.5 2.3-11.3 6.2C38.3 11.6 35.3 10 32 10Z"
          fill="currentColor"
          className="logo-icon-heart"
        />
        <path
          d="M14 30h8l4-10 6 12 6-8h8"
          stroke="var(--color-accent)"
          strokeWidth="3.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <span className="logo-copy">
        <span className="logo-copy-main">Saude</span>
        <span className="logo-copy-accent">flex</span>
      </span>
    </span>
  )
}
