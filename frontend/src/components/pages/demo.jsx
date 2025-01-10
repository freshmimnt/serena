import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import "../css/Demo.css";
import Footer from './footer';

const Demo = () => {
    
    const footerRef = useRef(null);
   
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const scrollToFooter = (e) => {
        e.preventDefault(); 
        footerRef.current.scrollIntoView({ behavior: 'smooth' });
    };

    const [values, setValues] = useState({
        name: "",
        email: "",
        
    })

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const response = await axios.post("http://localhost:8000/api/requestDemo", values);
    
            if (response.status == 200) {
                alert("Pedido com sucesso");
                navigate("/");
            } else {
                alert("Something went wrong. Please try again.");
            }
        } catch (error) {
            console.error("Login error:", error);
            if (error.response && error.response.status === 400) {
                alert("Validation error: Please check your input fields.");
            } else {
                alert("An error occurred. Please try again later.");
            }
        }
    
    }
    return (
        <div>
            <div className='header'>
                <header className='header-content'>
                    <Link to="/" > <img src="src/assets/Logo.png" alt="Logo" /></Link>
                    <nav>
                        <ul>
                            <li>
                                <Link to="#" onClick={scrollToFooter}>Contactos</Link>
                            </li>
                            <li>
                                <Link to="/login">Login</Link>
                            </li>
                        </ul>
                    </nav>
                </header> 
            </div>
 
            <div className='container_text'>
                <h1>DÊ O PRÓXIMO PASSO PARA UMA EQUIPE DE SUCESSO</h1> 
                <p>Aqui no Serena, você não precisará esperar por contato! Assim que preencher o formulário abaixo, terá acesso
                imediato a uma demo provisória de 3 dias. Aproveite essa oportunidade para descobrir como podemos ajudar 
                sua equipe a melhorar o bem-estar mental e aumentar a produtividade. Experimente a Serena agora e veja 
                como podemos apoiar seus colaboradores!</p>
            </div>
            <form onSubmit={handleSubmit}>
                <div className='container_body'>
                    <input type="text" placeholder='Nome da Empresa' name='name' onChange={e => setValues({...values, name: e.target.value})}/>
                    <input type="email" placeholder='E-mail da Empresa' name='email' onChange={e => setValues({...values, email: e.target.value})}/>
                    <textarea className='mensagem' placeholder='Se deseja enviar alguma observação sobre sua demonstração digite aqui...'></textarea>                    
                    <button>Submeter</button>
                    <p>Ao submeter, autorizo que minhas informações pessoais sejam processadas pela Serena para atender à minha solicitação.</p>
                </div>
            </form>
            <Footer ref={footerRef} />
        </div>
    );
};

export default Demo;  