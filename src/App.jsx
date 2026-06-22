import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import PacienteLayout from './pages/paciente/PacienteLayout.jsx'
import PacienteCadastro from './pages/paciente/PacienteCadastro.jsx'
import PacienteTriagemInicial from './pages/paciente/PacienteTriagemInicial.jsx'
import PacientePainel from './pages/paciente/PacientePainel.jsx'
import EquipeLayout from './pages/equipe/EquipeLayout.jsx'
import EquipeFilaTriagem from './pages/equipe/EquipeFilaTriagem.jsx'
import EquipeTriagemForm from './pages/equipe/EquipeTriagemForm.jsx'
import EquipeAgendamento from './pages/equipe/EquipeAgendamento.jsx'
import EquipeLeitos from './pages/equipe/EquipeLeitos.jsx'
import EquipeEstoque from './pages/equipe/EquipeEstoque.jsx'
import EquipeProntuario from './pages/equipe/EquipeProntuario.jsx'
import EquipeAlertas from './pages/equipe/EquipeAlertas.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      {/* Fluxo do Paciente */}
      <Route path="/paciente" element={<PacienteLayout />}>
        <Route index element={<PacienteCadastro />} />
        <Route path="triagem" element={<PacienteTriagemInicial />} />
        <Route path="painel/:pacienteId" element={<PacientePainel />} />
      </Route>

      {/* Fluxo da Equipe */}
      <Route path="/equipe" element={<EquipeLayout />}>
        <Route index element={<EquipeFilaTriagem />} />
        <Route path="triagem/:pacienteId" element={<EquipeTriagemForm />} />
        <Route path="agendamento" element={<EquipeAgendamento />} />
        <Route path="leitos" element={<EquipeLeitos />} />
        <Route path="estoque" element={<EquipeEstoque />} />
        <Route path="prontuario" element={<EquipeProntuario />} />
        <Route path="alertas" element={<EquipeAlertas />} />
      </Route>
    </Routes>
  )
}
