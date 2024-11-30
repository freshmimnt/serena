import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async'
import "../css/Temp.css"; 
const Cancelado = () => (
    <>
        <Helmet>
            <title>Erro</title>
        </Helmet>
        <div className="sucesso-container">
            <div className="sucesso-box">
                <h1 className="sucesso-title">Pagamento cancelado</h1>
                <p className="sucesso-message">
                    O seu pagamento foi um insucesso
                </p>
                <Link to="/" className="sucesso-button">
                    Voltar à página inicial
                </Link>
            </div>
        </div>
    </>
);

export default Cancelado;