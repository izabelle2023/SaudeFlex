// walkthrough.mjs — script de verificação rápido (imprime passos)
const BASE = process.env.BASE || 'http://localhost:4000'

async function fetchJson(path, opts) {
  const res = await fetch(BASE + path, opts)
  const text = await res.text()
  try { return { ok: res.ok, status: res.status, body: JSON.parse(text) } } catch { return { ok: res.ok, status: res.status, body: text } }
}

(async () => {
  console.log('Walkthrough rápido — verificando endpoints básicos')
  const endpoints = ['/api/pacientes', '/api/triagens', '/api/agendamentos', '/api/estoque', '/api/leitos', '/api/alertas']
  for (const e of endpoints) {
    try {
      const r = await fetchJson(e)
      console.log(e, '->', r.status)
    } catch (err) {
      console.log(e, '-> error', err.message)
    }
  }
  console.log('Walkthrough concluído')
  process.exit(0)
})()
