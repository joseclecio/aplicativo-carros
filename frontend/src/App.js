import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// --- LAYOUTS E COMPONENTES DE AUTENTICAÇÃO ---
import LayoutPublico from './components/layout/LayoutPublico';
import RotaProtegida from './components/auth/RotaProtegida';

// --- PÁGINAS PÚBLICAS ---
import PaginaInicial from './pages/public/PaginaInicial';
import ListaLojas from './pages/public/ListaLojas';
import ListaVeiculos from './pages/public/ListaVeiculos';
import DetalhesVeiculo from './pages/public/DetalhesVeiculo';

// --- PÁGINAS DO PAINEL ADMIN ---
import PainelAdminLogin from './pages/admin/PainelAdminLogin';
import PainelAdminDashboard from './pages/admin/PainelAdminDashboard';
import FormularioVeiculo from './pages/admin/FormularioVeiculo';

// --- IMPORTS QUE FALTAVAM ---
// Adicione estas duas linhas para importar os novos componentes de gestão de lojas
import PainelLojas from './pages/admin/PainelLojas';
import FormularioLoja from './pages/admin/FormularioLoja';


function App() {
  return (
    <Router>
      <Routes>
        {/* --- ROTAS PÚBLICAS (DENTRO DO LAYOUT) --- */}
        <Route element={<LayoutPublico />}>
          <Route path="/" element={<PaginaInicial />} />
          <Route path="/lojas" element={<ListaLojas />} />
          <Route path="/particulares" element={<ListaVeiculos tipo="particular" />} />
          <Route path="/loja/:idLoja" element={<ListaVeiculos tipo="loja" />} />
          <Route path="/veiculo/:id" element={<DetalhesVeiculo />} />
        </Route>

        {/* --- ROTAS DO PAINEL ADMINISTRATIVO --- */}
        <Route path="/admin/login" element={<PainelAdminLogin />} />
        <Route element={<RotaProtegida />}>
          <Route path="/admin/dashboard" element={<PainelAdminDashboard />} />
          
          {/* ROTAS DE GESTÃO DE VEÍCULOS */}
          <Route path="/admin/veiculo/novo" element={<FormularioVeiculo />} />
          <Route path="/admin/veiculo/editar/:id" element={<FormularioVeiculo />} />
          
          {/* ROTAS DE GESTÃO DE LOJAS (JÁ EXISTENTES, AGORA COM IMPORT CORRETO) */}
          <Route path="/admin/lojas" element={<PainelLojas />} />
          <Route path="/admin/loja/novo" element={<FormularioLoja />} />
          <Route path="/admin/loja/editar/:id" element={<FormularioLoja />} />
        </Route>
        
        {/* Rota "Not Found" */}
        <Route path="*" element={<h2>404 - Página não encontrada</h2>} />
      </Routes>
    </Router>
  );
}

export default App;