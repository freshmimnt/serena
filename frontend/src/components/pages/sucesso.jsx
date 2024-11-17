import React from 'react';
import { Link } from 'react-router-dom';
import "../css/Temp.css"; 
const Sucesso = () => (
    <div className="sucesso-container">
        <div className="sucesso-box">
            <h1 className="sucesso-title">Compra finalizada com sucesso!</h1>
            <p className="sucesso-message">
                Irá receber no email da sua empresa as suas credenciais para aceder ao seu painel de administrador
            </p>
            <Link to="/" className="sucesso-button">
                Voltar à página inicial
            </Link>
        </div>
    </div>
);

export default Sucesso;
