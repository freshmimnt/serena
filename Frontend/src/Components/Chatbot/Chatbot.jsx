import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Chatbot.css";
import "bootstrap/dist/css/bootstrap.min.css"; 
import { FiSettings } from 'react-icons/fi';
import { FaTimes } from 'react-icons/fa';

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    
    const sendMessage = async () => {
        if (!input.trim()) return;

        const newMessage = { sender: "user", text: input };
        setMessages([...messages, newMessage]);

        try {
            const response = await fetch("http://localhost:5000/api/call", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ prompt: input }),
            });

            const data = await response.text();
            const botMessage = { sender: "bot", text: data };

            setMessages((prevMessages) => [...prevMessages, botMessage]);
        } catch (error) {
            console.error("Erro ao enviar a mensagem:", error);
            setMessages((prevMessages) => [
                ...prevMessages,
                { sender: "bot", text: "Erro ao gerar resposta. Tente novamente mais tarde." }
            ]);
        }

        setInput(""); 
    };

 
    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            e.preventDefault(); 
            sendMessage();
        }
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
                <h1>Olá, sou sua terapeuta, sinta-se à vontade para compartilhar o que estiver em sua mente, seja o que for.</h1>
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
                            <p>Requer um desafio extra de segurança ao iniciar sessão.</p>
                            <button onClick={() => alert("2FA ativado/desativado")}>Ativar/Desativar 2FA</button>
                        </div>
                        <div className="modal-section">
                            <h3>Mudar Senha</h3>
                            <input type="password" placeholder="Digite nova senha" />
                            <button onClick={() => alert("Senha alterada")}>Mudar Senha</button>
                        </div>
                        <div className="modal-section">
                            <h3>Seu Email</h3>
                            <p>funcionario@gmail.com</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
