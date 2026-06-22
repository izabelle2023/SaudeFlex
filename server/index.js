import express from 'express'
import fs from 'fs'
import path from 'path'
import cors from 'cors'
import bodyParser from 'body-parser'

const app = express()
app.use(cors())
app.use(bodyParser.json())

const DATA_FILE = path.resolve('./server/data.json')

function readData() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'))
  } catch (e) {
    return { pacientes: [], triagens: [], agendamentos: [], medicos: [], estoque: [], leitos: [], historico: [], alertas: [] }
  }
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8')
}

// Simple UID used by server
function uid(prefix = 'id') {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

app.get('/api/pacientes', (req, res) => {
  const data = readData()
  res.json(data.pacientes || [])
})

app.get('/api/pacientes/:id', (req, res) => {
  const data = readData()
  const p = (data.pacientes || []).find((x) => x.id === req.params.id)
  if (!p) return res.status(404).json({ error: 'NOT_FOUND' })
  res.json(p)
})

app.post('/api/pacientes', (req, res) => {
  const data = readData()
  const paciente = req.body
  if (paciente.id) {
    const idx = (data.pacientes || []).findIndex((p) => p.id === paciente.id)
    if (idx >= 0) {
      data.pacientes[idx] = { ...data.pacientes[idx], ...paciente }
      writeData(data)
      return res.json(data.pacientes[idx])
    }
  }
  const novo = { id: uid('pac'), criadoEm: new Date().toISOString(), ...paciente }
  data.pacientes.push(novo)
  writeData(data)
  res.json(novo)
})

app.get('/api/triagens', (req, res) => {
  const data = readData()
  res.json(data.triagens || [])
})

app.post('/api/triagens', (req, res) => {
  const data = readData()
  const novo = { id: uid('tri'), criadoEm: new Date().toISOString(), ...req.body }
  data.triagens.push(novo)
  writeData(data)
  res.json(novo)
})

app.get('/api/medicos', (req, res) => {
  const data = readData()
  res.json(data.medicos || [])
})

app.get('/api/estoque', (req, res) => {
  const data = readData()
  res.json(data.estoque || [])
})

app.post('/api/estoque', (req, res) => {
  const data = readData()
  const item = { id: uid('est'), ...req.body }
  data.estoque.push(item)
  writeData(data)
  res.json(item)
})

app.post('/api/agendamentos', (req, res) => {
  const data = readData()
  const ag = { id: uid('ag'), criadoEm: new Date().toISOString(), ...req.body }
  data.agendamentos.push(ag)
  writeData(data)
  res.json(ag)
})

app.get('/api/alertas', (req, res) => {
  const data = readData()
  res.json(data.alertas || [])
})

app.post('/api/alertas', (req, res) => {
  const data = readData()
  const novo = { id: uid('alerta'), criadoEm: new Date().toISOString(), lido: false, ...req.body }
  data.alertas.push(novo)
  writeData(data)
  res.json(novo)
})

const port = process.env.PORT || 4000
app.listen(port, () => console.log(`Saudeflex server running on http://localhost:${port}`))
