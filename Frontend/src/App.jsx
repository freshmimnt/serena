import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Importando Router
import Login from './Components/Login/Login';
import Demo from './Components/Demo/Demo';
import LandingPage from './Components/LandingPage/LandingPage';

function App() {
  return (
    <Router> 
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/demo" element={<Demo />} />
      </Routes>
    </Router>
  );
}

export default App;
