import { useState } from 'react'
import { listarEstoque, ajustarEstoque, adicionarItemEstoque } from '../../utils/db.js'
import './EquipeComum.css'
import './EquipeEstoque.css'

export default function EquipeEstoque() {
  const [, setTick] = useState(0)
  const [modalAberto, setModalAberto] = useState(false)
  const [novoItem, setNovoItem] = useState({ nome: '', categoria: '', quantidade: '', minimo: '', unidade: '' })
  const estoque = listarEstoque().sort((a, b) => (a.quantidade < a.minimo ? -1 : 1) - (b.quantidade < b.minimo ? -1 : 1))

  const abaixoDoMinimo = estoque.filter((i) => i.quantidade < i.minimo).length

  function ajustar(id, delta) {
    ajustarEstoque(id, delta)
    setTick((t) => t + 1)
  }

  function salvarNovoItem(e) {
    e.preventDefault()
    if (!novoItem.nome || novoItem.quantidade === '' || novoItem.minimo === '') return
    adicionarItemEstoque(novoItem)
    setNovoItem({ nome: '', categoria: '', quantidade: '', minimo: '', unidade: '' })
    setModalAberto(false)
    setTick((t) => t + 1)
  }

  return (
    <div>
      <div className="pagina-header">
        <div>
          <h1>Controle de estoque</h1>
          <p className="pagina-sub">Itens abaixo do mínimo geram alertas automáticos.</p>
        </div>
        <button className="btn-primario" onClick={() => setModalAberto(true)}>+ Novo item</button>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-valor">{estoque.length}</div>
          <div className="kpi-label">Itens cadastrados</div>
        </div>
        <div className="kpi-card" style={{ borderColor: abaixoDoMinimo > 0 ? 'var(--color-emergencia)' : undefined }}>
          <div className="kpi-valor" style={{ color: abaixoDoMinimo > 0 ? 'var(--color-emergencia)' : undefined }}>{abaixoDoMinimo}</div>
          <div className="kpi-label">Abaixo do mínimo</div>
        </div>
      </div>

      <div className="painel-cartao">
        <table className="tabela-estoque">
          <thead>
            <tr>
              <th>Item</th>
              <th>Categoria</th>
              <th>Quantidade</th>
              <th>Mínimo</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {estoque.map((item) => {
              const baixo = item.quantidade < item.minimo
              return (
                <tr key={item.id} className={baixo ? 'linha-alerta' : ''}>
                  <td className="celula-nome">{item.nome}</td>
                  <td>{item.categoria}</td>
                  <td className={baixo ? 'qtd-baixa' : ''}>{item.quantidade} {item.unidade}</td>
                  <td>{item.minimo}</td>
                  <td>
                    <div className="ajuste-controles">
                      <button className="btn-ajuste" onClick={() => ajustar(item.id, -1)}>−</button>
                      <button className="btn-ajuste" onClick={() => ajustar(item.id, 1)}>+</button>
                      <button className="btn-ajuste" onClick={() => ajustar(item.id, 10)}>+10</button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {modalAberto && (
        <div className="modal-overlay" onClick={() => setModalAberto(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h2 className="form-titulo">Novo item de estoque</h2>
            <form className="agendamento-form" onSubmit={salvarNovoItem}>
              <label className="campo">
                Nome
                <input value={novoItem.nome} onChange={(e) => setNovoItem((v) => ({ ...v, nome: e.target.value }))} />
              </label>
              <label className="campo">
                Categoria
                <input value={novoItem.categoria} onChange={(e) => setNovoItem((v) => ({ ...v, categoria: e.target.value }))} placeholder="Medicamento, EPI, Insumo..." />
              </label>
              <div className="campo-linha">
                <label className="campo">
                  Quantidade inicial
                  <input type="number" value={novoItem.quantidade} onChange={(e) => setNovoItem((v) => ({ ...v, quantidade: e.target.value }))} />
                </label>
                <label className="campo">
                  Mínimo recomendado
                  <input type="number" value={novoItem.minimo} onChange={(e) => setNovoItem((v) => ({ ...v, minimo: e.target.value }))} />
                </label>
              </div>
              <label className="campo">
                Unidade
                <input value={novoItem.unidade} onChange={(e) => setNovoItem((v) => ({ ...v, unidade: e.target.value }))} placeholder="comprimidos, frascos, unidades..." />
              </label>
              <button type="submit" className="btn-primario">Adicionar item</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
