import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../css/Stripe.css"; 
import axios from "axios";

const Sucesso = () => {
    const navigate = useNavigate();

    const params = new URLSearchParams(window.location.search);
    const name = params.get("name");
    const email = params.get("email");
    const workers = params.get("workers");
    const payment = params.get("payment");
    const runOnce = useRef(false)

    useEffect(() => {
        if(runOnce.current === false){
            const registerCompany = async () => {

                try {
                    const response = await axios.post(
                        "http://localhost:8000/api/payment-success",
                        { name, email, workers, payment },
                        { withCredentials: true }
                    );
                
                } catch (error) {
                    if (error.response?.status === 409) {
                        alert("A empresa já foi registrada anteriormente.");
                    } else {
                        console.error("Erro ao registrar empresa:", error);
                        alert("Houve um problema ao registrar a empresa. Entre em contato com o suporte.");
                    }
                }
            };
            registerCompany();
        }
        return () => runOnce.current = true
    }, [name, email, workers, payment, navigate]);
    
    return (
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
};

export default Sucesso;
