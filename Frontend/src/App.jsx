import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import Login from './Components/Login/Login';
import Demo from './Components/Demo/Demo';
import LandingPage from './Components/LandingPage/LandingPage';
import Comprar from './Components/Comprar/Comprar';
import Pagar from './Components/Pagar/Pagar';
import Chatbot from './Components/Chatbot/Chatbot';
import Respiracao from './Components/Respiracao/Respiracao';
import Mindfulness from './Components/Mindfulness/Mindfulness';


function App() {
  return (
    <Router> 
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/demo" element={<Demo />} />
        <Route path="/comprar" element={<Comprar />} />
        <Route path="/pagar" element={<Pagar />} />
        <Route path='/chatbot' element={<Chatbot/>}/>
        <Route path='/respiracao' element={<Respiracao/>}/>
        <Route path='/mindfulness' element={<Mindfulness/>}></Route>
        

      </Routes>
    </Router>
  );
}

export default App;
