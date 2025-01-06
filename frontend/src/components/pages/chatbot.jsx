import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiSettings } from 'react-icons/fi';
import { FaTimes } from 'react-icons/fa';
import "../css/Chatbot.css";
import "bootstrap/dist/css/bootstrap.min.css"; 
import axios from "axios";

const Chatbot = () => {
    const navigate = useNavigate(); // Navigate for redirection
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const lastMessageRef = useRef(null);

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/verifyToken", { withCredentials: true });
                if (response.data.authenticated) {
                    setIsAuthenticated(true); 
                }
            } catch (error) {
                console.error("Token verification failed:", error);
                navigate("/login"); 
            }
        };
        verifyToken();
    }, [navigate]);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { sender: 'user', text: input };
        setMessages([...messages, userMessage]);

        try {
            const response = await axios.post("http://localhost:8000/api/chatbot", {
                message: input,
            }, { withCredentials: true });
            const { botResponse } = response.data;
            setMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    useEffect(() => {
        if (lastMessageRef.current) {
            lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="chatbot-wrapper">
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
                <h1>Olá {name}, sou sua terapeuta.</h1>
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
                    />
                    <button onClick={sendMessage}>Enviar</button>
                </div>
            </div>

            {isModalOpen && (
                <div className="modal-over">
                    <div className="modalcontent">
                        <button className="closemodal" onClick={toggleModal}><FaTimes /></button>
                        <h2>Configurações da Conta</h2>
                        {/* Additional Modal Content */}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
