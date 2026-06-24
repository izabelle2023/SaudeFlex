# Saudeflex

> Um gesto rápido de ter sua saúde de volta.

Sistema hospitalar simplificado com dois fluxos completos: **paciente** (cadastro + relato de sintomas) e **equipe** (triagem por prioridade clínica, agendamento, leitos, estoque, prontuário e alertas automáticos). Todos os dados ficam salvos no navegador (localStorage) — não precisa de servidor, banco de dados ou internet para funcionar.

## Como rodar

### Frontend

```bash
npm install
npm start
```

O comando `npm start` inicia o Vite localmente em vez de rodar a API do servidor.

Se quiser iniciar frontend e backend juntos:

```bash
npm install
npm run dev:all
```

Acesse o endereço mostrado no terminal (normalmente `http://localhost:5173`).

### Backend opcional

O projeto agora inclui um servidor Express básico em `server/index.js`, com dependências instaladas a partir do root.

```bash
npm install
npm run server
```

Ele expõe uma API em `http://localhost:4000` e o frontend tenta sincronizar dados com esse backend quando disponível. Ainda há fallback local via `localStorage` para manter o app funcional sem servidor.

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

React + Vite + React Router com backend Express opcional. Lógica de negócio centralizada em `src/utils/db.js`, e sincronização de API em `src/utils/api.js`.
