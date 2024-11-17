import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'; 
import "../css/Comprar.css";
import Footer from './footer';

const Comprar = () => {
    const footerRef = useRef(null);
    const [numFuncionarios, setNumFuncionarios] = useState(0);
    const [precoTotalAnual, setPrecoTotalAnual] = useState(0);
    const navigate = useNavigate(); 

    const precoPorFuncionario = 15;

    
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleNumFuncionariosChange = (e) => {
        const numero = Math.max(0, e.target.value);
        setNumFuncionarios(numero);
        setPrecoTotalAnual(numero * precoPorFuncionario);
    };

    const scrollToFooter = (e) => {
        e.preventDefault(); 
        footerRef.current.scrollIntoView({ behavior: 'smooth' });
    };

    const irParaPagamentos = () => {
        navigate('/pagar', { state: { numFuncionarios, precoTotalAnual } }); 
    };

    return (
        <div>
            <div className='header'>
                <header className='header-content'>
                    <img src="src/assets/Logo.png" alt="Logo" />
                    <nav>
                        <ul>
                            <li>
                                <a href="#" onClick={scrollToFooter}>Contactos</a>
                            </li>
                            <li>
                                <a href="/login">Login</a>
                            </li>
                        </ul>
                    </nav>
                </header> 
            </div>
                <div className="container_">
                    <div className="text_container">
                        <h1>Conheça nossa oferta para sua empresa</h1>
                    </div>
                    <div className="box-container">
                        <div className="input-preço">
                            <input 
                                type="number" 
                                placeholder="Número de Funcionários" 
                                value={numFuncionarios} 
                                onChange={handleNumFuncionariosChange} 
                                min="0"
                            />
                            <input 
                                type="text" 
                                placeholder="Preço total anual" 
                                value={`€ ${precoTotalAnual}`} 
                                readOnly  
                            />
                        </div>
                        <div className="input-dados">
                            <input type="email" placeholder="Email" />
                            <input type="text" placeholder="Nome Empresa" />
                        </div>
                        <button onClick={irParaPagamentos}>Ir para pagamentos</button> 
                    </div>
                </div> 
            
            <Footer ref={footerRef} />
        </div>
    );
};

export default Comprar;