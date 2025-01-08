import React, { useRef, useState, useEffect } from "react";
import { Link } from 'react-router-dom'; 
import "../css/Comprar.css";
import Footer from './footer';

const Comprar = () => {

    const footerRef = useRef(null);
    const [workers, setWorkers] = useState(0);
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [payment, setPayment] = useState(0);
    const pricePerWorker = 25;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleWorkersChange = (e) => {
        const number = Math.max(0, e.target.value);
        setWorkers(number);
        setPayment(number * pricePerWorker);
    };

    const handleCheckout = async () => {
        if (!email || !name || workers <= 0) {
            alert("Por-favor preencha todos os campos.");
            return;
        }
    
        try {
            const response = await fetch("http://localhost:8000/api/create-checkout-session", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ workers, email, name, payment }),
            });
    
            if (!response.ok) {
                const error = await response.text();
                console.error("Server error:", error);
                alert(`Error initiating payment: ${error}`);
                return;
            }
    
            const { url } = await response.json();
    
            if (url) {
                window.location.href = url;
            } else {
                alert("Unexpected error. No URL returned from server.");
            }
        } catch (error) {
            console.error("Checkout error:", error);
            alert("Something went wrong. Please try again.");
        }
    };
    
    return (
        <div>
            <div className='header'>
                <header className='header-content'>
                    <Link to="/" > <img src="src/assets/Logo.png" alt="Logo" /></Link>
                    <nav>
                        <ul>
                            <li>
                                <a href="#footer" onClick={(e) => e.preventDefault()}>
                                    Contactos
                                </a>
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
                                name="workers"
                                placeholder="Número de Funcionários"
                                value={workers}
                                onChange={handleWorkersChange}
                                min="0"
                            />
                            <input
                                type="text"
                                name="payment"
                                placeholder="Preço total anual"
                                value={`€ ${payment}`}
                                readOnly
                            />
                        </div>
                        <div className="input-dados">
                            <input
                                type="email"
                                placeholder="Email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Nome Empresa"
                                name="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <button onClick={handleCheckout}>Pagar</button>
                </div>
            </div>
            <Footer ref={footerRef} />
        </div>
    );
};

export default Comprar;