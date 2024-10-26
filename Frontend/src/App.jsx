import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import Login from './Components/Login/Login';
import Demo from './Components/Demo/Demo';
import LandingPage from './Components/LandingPage/LandingPage';
import Comprar from './Components/Comprar/Comprar';
import Pagar from './Components/Pagar/Pagar';

function App() {
  return (
    <Router> 
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/demo" element={<Demo />} />
        <Route path="/comprar" element={<Comprar />} />
        <Route path="/pagar" element={<Pagar />} />

      </Routes>
    </Router>
  );
}

export default App;
