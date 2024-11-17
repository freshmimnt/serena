import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {HelmetProvider, Helmet} from 'react-helmet-async';
import Login from './components/pages/login';
import Demo from './components/pages/demo';
import LandingPage from './components/pages/landingPage';
import Admin1 from './components/pages/adicionarUser';
import Admin2 from './components/pages/editarUser';
import Admin3 from './components/pages/settings';
import Comprar from './components/pages/comprar';
import Pagar from './components/pages/pagar';
import Chatbot from './components/pages/chatbot';
import Sucesso from './components/pages/sucesso';
import Cancelado from './components/pages/cancelado';

function App() {
  return (
    <HelmetProvider>
      <Router> 
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/add_user" element={<Admin1 />} />
          <Route path="/edit_user" element={<Admin2 />} />
          <Route path="/settings" element={<Admin3 />} />
          <Route path="/comprar" element={<Comprar />} />
          <Route path="/pagar" element={<Pagar />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/sucesso" element={<Sucesso/> } />
          <Route path="/cancelado" element={<Cancelado/> } />
        </Routes>
      </Router>
    </HelmetProvider>
  );
}

export default App;
