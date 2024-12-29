import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiSettings } from 'react-icons/fi';
import { FaTimes } from 'react-icons/fa';
import "../css/Chatbot.css";
import "bootstrap/dist/css/bootstrap.min.css"; 
import axios from "axios";


const Chatbot = () => {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };
    
    const sendMessage = async () => {
        axios.post("http://localhost:8000/api/chatbot")
    };

    useEffect (() => {
        axios.get("http://localhost:8000/api/verifyUser", { withCredentials: true })
        .then((response) => {
            setName(response.data.name);
            setEmail(response.data.email);
        })
        .catch((error) => console.error('Error fetching user details:', error));
    }, []);

    const handleLogout = () => {
        axios.get("http://localhost:8000/api/logout")
        .then(() => {
            window.location.href = "/";
        })
        .catch((error) => {
            console.error("Logout error:", error);
        });
    };  

    const handleChangePassword = (e) => {
        e.preventDefault();
        axios.post("http://localhost:8000/api/changePassword", { oldPassword, newPassword }, { withCredentials: true })
            .then(() => {
                alert("Senha alterada com sucesso");
            })
           .catch((error) => {
            console.error("Change password error:", error);
            alert("Não foi possível alterar a senha. Tente novamente mais tarde.");
        })
    };

    return (
        
        <div className="chatbot-wrapper">
            <div className="sidebar">
                <h4>Menu de Atividades</h4>
                <nav>
                    <ul>
                        <li className="sidebar-btn">
                            <Link to="#">Exercício de Respiração</Link>
                            <Link to="#">Relaxamento Progressivo</Link>
                            <Link to="#">Meditação Guiada</Link>
                        </li>
                    </ul>
                </nav>
                <div className="btn_config">
                    <button onClick={toggleModal}><FiSettings /></button>
                </div>
            </div>

            <div className="chatbot-container">
                <img src="public/Sigla.png" />
                <h1>Olá {name}, sou sua terapeuta, sinta-se à vontade para compartilhar o que estiver em sua mente, seja o que for.</h1>
                <div className="chat-display">
                    {messages.map((msg, index) => (
                        <div key={index} className={`message ${msg.sender}`}>
                            {msg.text}
                        </div>
                    ))}
                </div>
                <div className="input-container">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Diga-me como está se sentindo hoje?"
                        onKeyDown={handleKeyPress} 
                    />
                    <button onClick={sendMessage}>Enviar</button>
                </div>
            </div>

            {isModalOpen && (
                <div className="modal-over">
                    <div className="modalcontent">
                        <button className="closemodal" onClick={toggleModal}><FaTimes /></button>
                        <h2>Configurações da Conta</h2>
                        <div className="modal-section">
                            <h3>Apagar Conversas</h3>
                            <button onClick={() => setMessages([])}>Apagar Todas as Conversas</button>
                        </div>
                        <div className="modal-section">
                            <h3>Autenticação de Dois Fatores (2FA)</h3>
                            <p>Adicionar uma camada extra de segurança ao iniciar sessão.</p>
                            <button onClick={() => alert("2FA ativado/desativado")}>Ativar/Desativar 2FA</button>
                        </div>
                        <form onSubmit={handleChangePassword}>
                            <div className="modal-section">
                            <h3>Mudar Senha</h3>
                            <input type="password" 
                            value={oldPassword} 
                            onChange={(e) => setOldPassword(e.target.value)} 
                            placeholder="Antiga senha" />
                            <input type="password" 
                            value={newPassword} onChange={(e) => 
                            setNewPassword(e.target.value)} 
                            placeholder="Nova senha" />
                            <p></p>
                            <button type="submit">Mudar Senha</button>
                        </div>
                        </form>

                        <div className="modal-section">
                            <h3>Encerrar Sessão</h3>
                            <button onClick={handleLogout}>Logout</button>
                        </div>
                        <div className="modal-section">
                            <h3>Seu Email</h3>
                            <p>{email}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbot;