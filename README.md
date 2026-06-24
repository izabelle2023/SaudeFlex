# 🏥 SaudeFlex

> Um gesto rápido de ter sua saúde de volta.

Sistema web de gestão hospitalar desenvolvido para simular processos reais de atendimento em unidades de saúde, incluindo cadastro de pacientes, classificação de risco, agendamento de consultas, controle de leitos, gestão de estoque médico, prontuários e alertas operacionais.

O projeto foi desenvolvido utilizando **React, Vite e Express**, aplicando conceitos de desenvolvimento Full Stack, organização de dados, experiência do usuário e regras de negócio da área da saúde.

---

## 📖 Sobre o Projeto

O SaudeFlex nasceu com o objetivo de representar o fluxo de atendimento encontrado em hospitais, clínicas e unidades de pronto atendimento.

A aplicação permite que pacientes realizem sua pré-triagem, enquanto profissionais da saúde podem gerenciar todo o processo clínico e administrativo através de uma interface intuitiva.

O sistema foi projetado para demonstrar conhecimentos em:

* Desenvolvimento Front-End com React
* Desenvolvimento Back-End com Express.js
* Gerenciamento de estado e persistência de dados
* Implementação de regras de negócio
* Organização de componentes reutilizáveis
* Experiência do usuário (UX)
* Simulação de sistemas corporativos da área da saúde

---

## ✨ Principais Funcionalidades

### 👤 Área do Paciente

* Cadastro de pacientes
* Registro de sintomas
* Pré-triagem digital
* Entrada automática na fila de atendimento
* Acompanhamento da posição na fila
* Atualização em tempo real

### 🏥 Área da Equipe Médica

* Classificação de risco
* Gerenciamento da fila de atendimento
* Agendamento de consultas
* Controle de ocupação de leitos
* Gestão de estoque hospitalar
* Consulta de prontuários
* Sistema de alertas automáticos

---

## 🚦 Classificação de Risco

O sistema segue o modelo de Classificação de Risco Hospitalar utilizado em diversas unidades de saúde para priorizar pacientes conforme a gravidade do caso.

| Cor         | Prioridade    | Tempo Máximo de Atendimento |
| ----------- | ------------- | --------------------------- |
| 🔴 Vermelho | Emergência    | Imediato                    |
| 🟠 Laranja  | Muito Urgente | Até 10 minutos              |
| 🟡 Amarelo  | Urgente       | Até 1 hora                  |
| 🟢 Verde    | Pouco Urgente | Até 2 horas                 |
| 🔵 Azul     | Não Urgente   | Até 4 horas                 |

A ordenação da fila é realizada automaticamente conforme a prioridade clínica.

---

## 📅 Módulo de Agendamento

O sistema permite:

* Cadastro de consultas
* Seleção de médico
* Definição de horário
* Controle de disponibilidade
* Bloqueio automático de conflitos de agenda

Caso exista uma consulta marcada para o mesmo médico e horário, o sistema impede o agendamento duplicado.

---

## 🛏️ Gestão de Leitos

Controle da ocupação hospitalar por setor:

* Emergência
* Clínica Geral
* Pediatria
* Unidade de Terapia Intensiva (UTI)

Funcionalidades:

* Internação de pacientes
* Alta hospitalar
* Monitoramento da ocupação
* Histórico de movimentações

---

## 📦 Controle de Estoque

Gerenciamento de medicamentos e insumos hospitalares.

Recursos:

* Cadastro de itens
* Atualização de quantidades
* Definição de estoque mínimo
* Alertas automáticos para reposição

---

## 📋 Prontuário Eletrônico

Cada paciente possui um histórico completo contendo:

* Cadastro
* Triagens
* Consultas
* Internações
* Evolução clínica
* Eventos registrados pelo sistema

As informações são apresentadas em formato de linha do tempo para facilitar a consulta.

---

## 🔔 Central de Alertas

O sistema gera notificações automáticas para:

* Pacientes críticos
* Estoque abaixo do mínimo
* Leitos indisponíveis
* Pendências operacionais

---

## 💾 Persistência de Dados

Por padrão, os dados são armazenados localmente utilizando:

```text
localStorage
```

Isso permite que a aplicação funcione mesmo sem conexão com internet ou banco de dados.

Quando o backend estiver disponível, o frontend pode sincronizar informações através da API Express.

---

## 🛠️ Tecnologias Utilizadas

### Front-End

* React
* Vite
* React Router
* JavaScript (ES6+)
* CSS3

### Back-End

* Node.js
* Express.js

### Armazenamento

* LocalStorage
* API REST

---

## 📂 Estrutura do Projeto

```text
SaudeFlex/
│
├── public/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── utils/
│   │   ├── db.js
│   │   └── api.js
│   ├── App.jsx
│   └── main.jsx
│
├── server/
│   └── index.js
│
├── package.json
└── README.md
```

---

## 🚀 Como Executar o Projeto

### 1. Clonar o repositório

```bash
git clone https://github.com/izabelle2023/SaudeFlex.git
```

### 2. Acessar a pasta

```bash
cd SaudeFlex
```

### 3. Instalar dependências

```bash
npm install
```

### 4. Executar o Front-End

```bash
npm start
```

ou

```bash
npm run dev
```

### 5. Executar Front-End e Back-End

```bash
npm run dev:all
```

### 6. Executar apenas o servidor

```bash
npm run server
```

---

## 🔄 Resetar Dados de Demonstração

Abra o console do navegador (F12) e execute:

```javascript
localStorage.clear();
```

Depois atualize a página.

---

## 🎯 Objetivos do Projeto

* Simular processos hospitalares reais
* Aplicar conceitos de desenvolvimento Full Stack
* Demonstrar implementação de regras de negócio
* Exercitar modelagem de dados
* Desenvolver uma interface intuitiva para usuários e profissionais de saúde

---

## 👩‍💻 Desenvolvido por

**Izabelle Ferreira da Silva**

Desenvolvedora Full Stack Júnior formada em Engenharia de Software, com interesse em desenvolvimento web, banco de dados, integração de APIs e construção de soluções digitais que gerem impacto positivo para usuários e organizações.

Possui experiência no desenvolvimento de aplicações utilizando JavaScript, React, Node.js, PHP, SQL, MySQL, Git, GitHub e Postman, aplicando boas práticas de programação, organização de código e modelagem de dados.

O SaudeFlex foi desenvolvido como um projeto de simulação de gestão hospitalar, incorporando funcionalidades presentes em sistemas reais de saúde, como classificação de risco, agendamento de consultas, controle de leitos, gestão de estoque, prontuário eletrônico e alertas operacionais.

### 📫 Contato

* Email: [izabelle.ferreira2010@gmail.com](mailto:izabelle.ferreira2010@gmail.com)
* GitHub: https://github.com/izabelle2023
* LinkedIn: https://www.linkedin.com/in/izabellesilva-dev
