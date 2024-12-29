import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../css/Temp.css"; 
import axios from "axios";

const Sucesso = () => {
    const navigate = useNavigate();

    const params = new URLSearchParams(window.location.search);
    const name = params.get("name");
    const email = params.get("email");
    const workers = params.get("workers");
    const payment = params.get("payment");

    useEffect(() => {
        if (!name || !email || !workers || !payment) {
            console.error("Missing parameters in the URL.");
            return;
        }

        const registerCompany = async () => {
            try {
                await axios.post("http://localhost:8000/api/paymentSuccess", {
                    name,
                    email,
                    workers,
                    payment,
                });

                alert("A empresa foi registrada com sucesso.");
            } catch (error) {
                console.error("Erro ao registrar empresa:", error);
                alert("Houve um problema ao registrar a empresa. Entre em contato com o suporte.");
                navigate("/");
            }
        };

        registerCompany();
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
