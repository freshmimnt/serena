import { FaUser, FaLock } from "react-icons/fa"
import { Helmet } from 'react-helmet-async'
import { useState } from "react"
import { useNavigate } from "react-router-dom";
import "../css/Login.css";

const Login = () => {
    return (
        <>
            <Helmet>
                <title>Login</title>
            </Helmet>
            <div className="login-body">
                <div className="container">
                    <form action="">
                        <h1>SerenaAI</h1>
                        <div className="input-field">
                            <input type="email" name="email" placeholder="Email" required />
                            <FaUser className="icon" />
                        </div>
                        <div className="input-field">
                            <input
                                type="password"
                                name="password"
                                placeholder="Palavra-Passe"
                                required
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