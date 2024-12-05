import { FaUser, FaLock } from "react-icons/fa"
import { Helmet } from 'react-helmet-async'
import { useState } from "react"
import { useNavigate } from "react-router-dom";
import Axios from "axios";

import "../css/Login.css";

const Login = () => {

    const [values, setValues] = useState({
        email: "",
        password: "",
    }) 

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await Axios.post("http://localhost:8000/api/login", values);

            if (response.status === 200) {
                navigate("/");
            } else {
                alert("Email ou password inválidos");
            }
        } catch (error) {
            console.error("Login error:", error);
            alert("Ocorreu um erro. Por favor, tente novamente.");
        }
    }

    return (
        <>
            <Helmet>
                <title>Login</title>
            </Helmet>
            <div className="login-body">
                <div className="container">
                    <h1>SerenaAI</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="input-field">
                            <input type="email" 
                            name="email" 
                            placeholder="Email" 
                            required 
                            onChange={e => setValues({...values, email: e.target.value})} />
                            <FaUser className="icon" />
                        </div>
                        <div className="input-field">
                            <input
                                type="password"
                                name="password"
                                placeholder="Palavra-Passe"
                                required
                                onChange={e => setValues({...values, password: e.target.value})}
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