import React, { useEffect, useState, useRef } from "react";
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
    const [chatbotState, setChatbotState] = useState("inicio");
    const [loading, setLoading] = useState(false);
    const [showPasswordReminder, setShowPasswordReminder]= useState(false);
    const lastMessageRef = useRef(null); 
    /*const [Auth, SetAuth] = useState*/

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };


    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            sendMessage();
        }
    };

    const sendMessage = async () => {
        if (!input.trim()) return;
    
        const userMessage = { sender: 'user', text: input };
        setMessages([...messages, userMessage]);
    
        try {
            setLoading(true);
            const response = await axios.post('http://localhost:8000/api/chatbot', {
                message: input,
                state: chatbotState
            }, { withCredentials: true });
    
            const { botResponse, nextState } = response.data;
            setMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);
            setChatbotState(nextState);
        } catch (error) {
            console.error("Error sending message:", error);
        }finally {
            setLoading(false);
        }
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

    const handleDelete = (e) => {
        e.preventDefault();
        axios.delete("http://localhost:8000/api/deleteChat",{ withCredentials: true } )
        .then(() => {
            alert("Chat apagado com sucesso");
        })
        .catch((error) => {
            console.error("Delete chat error:", error);
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

    useEffect(() => {
        const reminderShow = localStorage.getItem("passwordReminderShown");
        if (!reminderShow){
            setShowPasswordReminder(true);
        }
    }, []);

    const handleDismissReminder = () => {
        setShowPasswordReminder(false);
        localStorage.setItem("passwordReminderShown", "true");
    };
//aqui terminou o lembrete da mudança da senha
   
    useEffect(() => {
        if (lastMessageRef.current) {
            lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    return ( 
        <div className="chatbot-wrapper">
            {showPasswordReminder && (
                <div className="password-reminder">
                    <p>Por segurança, recomendamos alterar sua senha o mais breve possível.</p>
                    <button onClick={handleDismissReminder}>Entendido</button>
                </div>
            )}
            <div className="sidebar">
                <h4>Menu de Atividades</h4>
                <nav>
                    <ul>
                        <li className="sidebar-btn">
                            <Link to="/respiracao">Exercício de Respiração</Link>
                            <Link to="/mindfulness">Técnica de Mindfulness</Link>
                        </li>
                    </ul>
                </nav>
                <div className="btn_config">
                    <button onClick={toggleModal}><FiSettings /></button>
                </div>
            </div>

        <div className="chatbot-container">
            <img src="/Sigla.png" alt="Sigla" />
            <h1>Olá {name}, sou sua terapeuta.</h1>
            <div className="chat-display">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.sender}`}>
                        {msg.text}
                    </div>
                ))}
            </div>
            {loading && <p>Bot is typing...</p>}
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
                            <button onClick={handleDelete}>Apagar Todas as Conversas</button>
                        </div>
                        <div className="modal-section">
                            <h3>Autenticação de Dois Fatores (2FA)</h3>
                            <p>Adicionar uma camada extra de segurança ao iniciar sessão.</p>
                            <button onClick={() => alert("2FA ativado/desativado")}>Ativar/Desativar 2FA</button>
                        </div>
                        <form onSubmit={handleChangePassword}>
                            <div className="modal-section">
                            <h3>Mudar Senha</h3>
                            <input 
                            type="password" 
                            value={oldPassword} 
                            onChange={(e) => setOldPassword(e.target.value)} 
                            placeholder="Antiga senha" />
                            <input type="password" 
                            value={newPassword} onChange={(e) => 
                            setNewPassword(e.target.value)} 
                            placeholder="Nova senha" />
                            <hr />
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