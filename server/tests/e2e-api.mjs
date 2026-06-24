// e2e-api.mjs — testes de integração básicos contra o backend
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

async function assert(cond, msg) {
  if (!cond) {
    throw new Error(msg)
  }
}

;(async () => {
  console.log('Iniciando E2E API tests against', BASE)
  await waitForServer()

  // 1) criar paciente
  const cpf = `000${Date.now() % 1000000}`
  let r = await fetchJson('/api/pacientes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nome: 'Teste E2E', cpf }) })
  await assert(r.ok, 'Falha ao criar paciente')
  const paciente = r.body
  console.log('Paciente criado:', paciente.id)

  // 2) buscar por CPF
  r = await fetchJson(`/api/pacientes/search?cpf=${encodeURIComponent(cpf)}`)
  await assert(r.ok, 'Falha ao buscar paciente por CPF')
  console.log('Busca por CPF ok')

  // 3) criar triagem
  r = await fetchJson('/api/triagens', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ pacienteId: paciente.id, sintomas: 'dor de cabeça', prioridade: 'verde', profissional: 'E2E' }) })
  await assert(r.ok, 'Falha ao criar triagem')
  const triagem = r.body
  console.log('Triagem criada:', triagem.id)

  // 4) finalizar triagem
  r = await fetchJson(`/api/triagens/${triagem.id}/status`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'finalizado' }) })
  await assert(r.ok && r.body.status === 'finalizado', 'Falha ao finalizar triagem')
  console.log('Triagem finalizada')

  // 5) criar estoque e ajustar para gerar alerta
  r = await fetchJson('/api/estoque', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nome: 'TesteMed', categoria: 'Medicamento', quantidade: 5, minimo: 10, unidade: 'un' }) })
  await assert(r.ok, 'Falha ao criar item de estoque')
  const item = r.body
  console.log('Item de estoque criado:', item.id)

  // ajustar -5 para ficar abaixo do minimo
  r = await fetchJson(`/api/estoque/${item.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ delta: -3 }) })
  await assert(r.ok, 'Falha ao ajustar estoque')
  console.log('Estoque ajustado, quantidade atual:', r.body.quantidade)

  // 6) criar leito e ocupar
  r = await fetchJson('/api/leitos', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ setor: 'Teste', numero: 'T-01' }) })
  await assert(r.ok, 'Falha ao criar leito')
  const leito = r.body
  console.log('Leito criado:', leito.id)

  r = await fetchJson('/api/leitos/ocupar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ leitoId: leito.id, pacienteId: paciente.id }) })
  await assert(r.ok, 'Falha ao ocupar leito')
  console.log('Leito ocupado')

  // 7) liberar leito
  r = await fetchJson('/api/leitos/liberar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ leitoId: leito.id }) })
  await assert(r.ok, 'Falha ao liberar leito')
  console.log('Leito liberado')

  console.log('E2E API tests finalizados com sucesso')
})().catch((err) => {
  console.error('ERRO:', err.message)
  process.exitCode = 1
})
