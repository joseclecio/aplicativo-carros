import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// --- LAYOUTS E COMPONENTES DE AUTENTICAÇÃO ---
import LayoutPublico from './components/layout/LayoutPublico'; // <<< Importamos o novo layout
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

function App() {
  return (
    <Router>
      <Routes>
        {/* --- ROTAS PÚBLICAS (AGORA DENTRO DO LAYOUT) --- */}
        {/* O componente LayoutPublico será renderizado e a <Outlet> dentro dele
            será substituída pelo `element` da rota filha que corresponde à URL. */}
        <Route element={<LayoutPublico />}>
          <Route path="/" element={<PaginaInicial />} />
          <Route path="/lojas" element={<ListaLojas />} />
          <Route path="/particulares" element={<ListaVeiculos tipo="particular" />} />
          <Route path="/loja/:idLoja" element={<ListaVeiculos tipo="loja" />} />
          <Route path="/veiculo/:id" element={<DetalhesVeiculo />} />
        </Route>

        {/* --- ROTAS DO PAINEL ADMINISTRATIVO (FICAM FORA DO LAYOUT PÚBLICO) --- */}
        <Route path="/admin/login" element={<PainelAdminLogin />} />
        <Route element={<RotaProtegida />}>
          <Route path="/admin/dashboard" element={<PainelAdminDashboard />} />
          <Route path="/admin/veiculo/novo" element={<FormularioVeiculo />} />
          <Route path="/admin/veiculo/editar/:id" element={<FormularioVeiculo />} />
        </Route>
        
        {/* Rota "Not Found" */}
        <Route path="*" element={<h2>404 - Página não encontrada</h2>} />
      </Routes>
    </Router>
  );
}

export default App;