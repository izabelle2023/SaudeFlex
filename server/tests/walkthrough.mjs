// walkthrough.mjs — script de verificação rápido (imprime passos)
const BASE = process.env.BASE || 'http://localhost:4000'

async function fetchJson(path, opts) {
  const res = await fetch(BASE + path, opts)
  const text = await res.text()
  try { return { ok: res.ok, status: res.status, body: JSON.parse(text) } } catch { return { ok: res.ok, status: res.status, body: text } }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function waitForServer(retries = 10, interval = 500) {
  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      const res = await fetch(BASE + '/api/pacientes')
      if (res.ok) return
    } catch (err) {
      // ignore until the server is ready
    }
    if (attempt < retries) await delay(interval)
  }
  throw new Error(`Servidor não respondeu em ${BASE} após ${retries * interval}ms`)
}

;(async () => {
  console.log('Walkthrough rápido — verificando endpoints básicos')
  await waitForServer()
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
})().catch((err) => {
  console.error('ERRO:', err.message)
  process.exitCode = 1
})
