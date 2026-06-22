# Saudeflex

> Um gesto rápido de ter sua saúde de volta.

Sistema hospitalar simplificado com dois fluxos completos: **paciente** (cadastro + relato de sintomas) e **equipe** (triagem por prioridade clínica, agendamento, leitos, estoque, prontuário e alertas automáticos). Todos os dados ficam salvos no navegador (localStorage) — não precisa de servidor, banco de dados ou internet para funcionar.

## Como rodar

```bash
npm install
npm run dev
```

Acesse o endereço mostrado no terminal (normalmente `http://localhost:5173`).

## Como usar

**Tela inicial** → escolha "Sou paciente" ou "Sou da equipe".

### Fluxo do paciente
1. Cadastro com nome, CPF, nascimento, telefone e convênio.
2. Seleção de sintomas (ou descrição livre).
3. Entra automaticamente na fila de atendimento e acompanha sua posição em tempo real.

### Fluxo da equipe
- **Fila de Triagem**: lista ordenada por prioridade (🔴 Emergência → 🟡 Urgente → 🟢 Normal). Pacientes que fizeram pré-triagem sozinhos aparecem com a tag "Pré-triagem do paciente" e precisam ser **classificados** por um profissional antes de avançar.
- **Agendamento**: marca consultas por médico/horário. O sistema **bloqueia automaticamente** dois agendamentos no mesmo horário para o mesmo médico.
- **Leitos**: ocupação em tempo real por setor (Emergência, Clínica Geral, Pediatria, UTI). Internar e dar alta gera eventos no histórico do paciente.
- **Estoque**: controle de quantidade com alerta automático quando um item fica abaixo do mínimo.
- **Prontuário**: busca por paciente e exibe linha do tempo completa (triagens, consultas, internações).
- **Alertas**: central de avisos automáticos (paciente crítico, estoque baixo, leitos esgotados).

## Resetar os dados de demonstração

No console do navegador (F12), rode:
```js
localStorage.clear()
```
e recarregue a página — os dados de exemplo voltam (médicos, leitos e estoque iniciais).

## Stack

React + Vite + React Router, sem backend. Lógica de negócio centralizada em `src/utils/db.js`.
