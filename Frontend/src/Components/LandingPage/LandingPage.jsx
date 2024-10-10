import React from 'react';
import { Link } from 'react-router-dom'; 

const LandingPage = () => {
  return (
    <div>
      <h1>Bem-vindo ao SerenaAI</h1>
      <Link to="/login">Login</Link>
      <Link to="/demo">Demo</Link>
    </div>
  );
};

export default LandingPage;
