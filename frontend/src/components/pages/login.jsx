import { FaUser, FaLock } from "react-icons/fa"
import { Helmet } from 'react-helmet-async'
import { useState } from "react"
import { useNavigate } from "react-router-dom";
import "../css/Login.css";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate(); 

    const handleSubmit = (event) => {
        event.preventDefault();

        
        if (username && password) { 
            navigate("/chatbot"); 
        } else {
            alert("Por favor, insira um e-mail e senha válidos.");
        }
    };

    return (
        <>
            <Helmet>
                <title>Login</title>
            </Helmet>
            <div className="login-body">
                <div className="container">
                    <form onSubmit={handleSubmit}>
                        <h1>SerenaAI</h1>
                        <div className="input-field">
                            <input 
                                type="email" 
                                placeholder="E-mail" 
                                onChange={(e) => setUsername(e.target.value)} 
                            /> 
                            <FaUser className="icon" />
                        </div>
                        <div className="input-field">
                            <input 
                                type="password" 
                                placeholder="Senha"
                                onChange={(e) => setPassword(e.target.value)} 
                            />
                            <FaLock className="icon" />
                        </div>
                        <div className="esqueceu">
                            <a href="#">Esqueceu a senha?</a>
                        </div>
                        <button type="submit">Entrar</button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Login;