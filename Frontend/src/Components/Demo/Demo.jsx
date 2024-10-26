import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "./Demo.css";
import Footer from '../Footer/Footer';

const Demo = () => {
    
    const footerRef = useRef(null);

   
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const scrollToFooter = (e) => {
        e.preventDefault(); 
        footerRef.current.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div>
            <div className='header'>
                <header className='header-content'>
                    <img src="src/assets/Logo.png" alt="Logo" />
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

            <div className='container_body'>
                <input type="text" placeholder='Nome'/>
                <input type="text" placeholder='Nome da Empresa'/>
                <input type="email" placeholder='E-mail da Empresa'/>
                <textarea className='mensagem' placeholder='Se deseja enviar alguma observação sobre sua demonstração digite aqui...'></textarea>                    
                <button>Submeter</button>
                <p>Ao submeter, autorizo que minhas informações pessoais sejam processadas pela Serena para atender à minha solicitação.</p>
            </div>

            <Footer ref={footerRef} />
        </div>
    );
};

export default Demo;  
