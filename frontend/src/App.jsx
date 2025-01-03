import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {HelmetProvider, Helmet} from 'react-helmet-async';
import Login from './components/pages/login';
import Demo from './components/pages/demo';
import LandingPage from './components/pages/landingPage';
import Comprar from './components/pages/comprar';
import Chatbot from './components/pages/chatbot';
import Sucesso from './components/pages/sucesso';
import Cancelado from './components/pages/cancelado';
import Admin from './components/pages/admin';
import AdminSettings from './components/pages/settings';
import Gerenciar from './components/pages/gerenciar';
import RedefinirSenha from './components/pages/redefinirSenha';
import RecuperarSenha from './components/pages/recuperarSenha';
import Mindfulness from './components/pages/mindfulness';
import Respiracao from './components/pages/respiracao'; 

function App() {
  return (
    <HelmetProvider>
      <Router> 
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/comprar" element={<Comprar />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/sucesso" element={<Sucesso/> } />
          <Route path="/cancelado" element={<Cancelado/> } />
          <Route path="/admin" element={<Admin />} />
          <Route path="/settings" element={<AdminSettings />} />
          <Route path="/gerenciar" element={<Gerenciar />} />
          <Route path="/redefinirSenha" element={<RedefinirSenha />} />
          <Route path="/recuperarSenha" element={<RecuperarSenha />} />
          <Route path="/mindfulness" element={<Mindfulness />} />
          <Route path="/respiracao" element={<Respiracao />} />
        </Routes>
      </Router>
    </HelmetProvider>
  );
}

export default App;
