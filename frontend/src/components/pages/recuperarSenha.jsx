import { useState } from "react";
import axios from "axios";

const RecuperarSenha = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:8000/api/recuperarSenha", { email });
            setMessage(response.data.message); 
        } catch (error) {
            setMessage(error.response?.data.message || "Erro ao enviar o e-mail.");
        }
    };

    return (
        <div>
            <h2>Recuperar Senha</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Digite seu e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit">Enviar Link de Recuperação</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default RecuperarSenha;
