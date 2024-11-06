import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import './Pagar.css';

const Pagar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { numFuncionarios, precoTotalAnual } = location.state || { numFuncionarios: 0, precoTotalAnual: 0 };

    const [showModal, setShowModal] = useState(false);

    
    useEffect(() => {
        window.scrollTo(0, 0); 
    }, []);

    const handleFinalizarCompra = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        navigate('/'); 
    };
 
    return (
        <div>
            <div className='header'>
                <header className='header-content'>
                    <img src="src/assets/Logo.png" alt="Logo" />
                    <nav>
                        <ul>
                            <li>
                                <Link to="/comprar">Cancelar</Link>
                            </li>
                        </ul>
                    </nav>
                </header>
            </div>

            <div className='body'>
                <h1>Finalizar compra</h1>
                
                <div className='box-dados'>
                    <h2>Resumo: Licença anual para {numFuncionarios} funcionários: €{precoTotalAnual}</h2>
                    <h2>Total: €{precoTotalAnual}</h2>
                    
                    <div className="img-container">
                        <img src="src/assets/visa.png" alt="Visa" />
                        <img src="src/assets/MasterCard.png" alt="MasterCard" />
                        <img src="src/assets/American-Express.png" alt="American Express" />
                    </div>

                    <input type="text" placeholder='Titular do Cartão' />
                    <input type="text" placeholder='Número do cartão' />
                    <input type="date" placeholder='Data de validade' />
                    <input type="text" placeholder='CVC/CVV' />

                    <button onClick={handleFinalizarCompra}>Finalizar a compra</button>
                </div>
            </div>

            {showModal && (
                <div className='modal-overlay'>
                    <div className='modal-content'>
                        <button className='close-icon' onClick={handleCloseModal}><FaTimes /></button>
                        <h2>Compra finalizada com sucesso!</h2>
                        <p>Irá receber no email registrado a credencial para aceder ao seu painel de administrador</p>
                        <p>Obrigado</p>
                    </div>
                </div> 
            )}
        </div>
    );
};

export default Pagar;
