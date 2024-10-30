import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {HelmetProvider, Helmet} from 'react-helmet-async';
import Login from './components/views/login';
import Demo from './components/views/demo';
import LandingPage from './components/views/landingPage';
import Admin1 from './components/views/adicionarUser';
import Admin2 from './components/views/editarUser';
import Admin3 from './components/views/settings';

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
        </Routes>
      </Router>
    </HelmetProvider>
  );
}

export default App;
