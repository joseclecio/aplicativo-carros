import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// --- LAYOUTS E COMPONENTES DE AUTENTICAÇÃO ---
import LayoutPublico from './components/layout/LayoutPublico';
import LayoutAdmin from './components/layout/LayoutAdmin'; // O nosso novo layout do painel
import RotaProtegida from './components/auth/RotaProtegida';

// --- PÁGINAS PÚBLICAS ---
import PaginaInicial from './pages/public/PaginaInicial';
import ListaLojas from './pages/public/ListaLojas';
import ListaVeiculos from './pages/public/ListaVeiculos';
import DetalhesVeiculo from './pages/public/DetalhesVeiculo';

// --- PÁGINAS DO PAINEL ADMIN ---
import PainelAdminLogin from './pages/admin/PainelAdminLogin';
import PainelAdminDashboard from './pages/admin/PainelAdminDashboard';
import PainelLojas from './pages/admin/PainelLojas';
import FormularioVeiculo from './pages/admin/FormularioVeiculo';
import FormularioLoja from './pages/admin/FormularioLoja';

function App() {
  return (
    <Router>
      <Routes>
        {/* --- ROTAS PÚBLICAS --- */}
        <Route element={<LayoutPublico />}>
          <Route path="/" element={<PaginaInicial />} />
          <Route path="/lojas" element={<ListaLojas />} />
          <Route path="/particulares" element={<ListaVeiculos tipo="particular" />} />
          <Route path="/loja/:idLoja" element={<ListaVeiculos tipo="loja" />} />
          <Route path="/veiculo/:id" element={<DetalhesVeiculo />} />
        </Route>

        {/* --- ROTAS DO PAINEL ADMINISTRATIVO --- */}

        {/* A rota de login continua separada */}
        <Route path="/admin/login" element={<PainelAdminLogin />} />
        
        {/* --- INÍCIO DA CORREÇÃO ---
          Criamos uma rota "mãe" com o caminho "/admin". Ela renderiza o LayoutAdmin.
          Todas as rotas filhas agora terão os seus caminhos relativos a "/admin".
          Ex: "/admin" + "dashboard" = "/admin/dashboard"
        */}
        <Route path="/admin" element={<RotaProtegida />}>
          <Route element={<LayoutAdmin />}>
            {/* O "index" define qual componente carregar na rota "/admin" exata */}
            <Route index element={<PainelAdminDashboard />} /> 
            <Route path="dashboard" element={<PainelAdminDashboard />} />
            <Route path="lojas" element={<PainelLojas />} />
            <Route path="veiculo/novo" element={<FormularioVeiculo />} />
            <Route path="veiculo/editar/:id" element={<FormularioVeiculo />} />
            <Route path="loja/novo" element={<FormularioLoja />} />
            <Route path="loja/editar/:id" element={<FormularioLoja />} />
          </Route>
        </Route>
        {/* --- FIM DA CORREÇÃO --- */}
        
        {/* Rota "Not Found" */}
        <Route path="*" element={<h2>404 - Página não encontrada</h2>} />
      </Routes>
    </Router>
  );
}

export default App;