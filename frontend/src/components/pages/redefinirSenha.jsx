import { useState } from "react";
import axios from "axios";

const RedefinirSenha = ({ match }) => {
    const { email } = match.params;
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleResetPassword = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:8000/api/redefinirSenha", {
                email,
                newPassword,
            });
            setMessage(response.data.message); 
        } catch (error) {
            setMessage(error.response?.data.message || "Erro ao redefinir a senha.");
        }
    };

    return (
        <div>
            <h2>Redefinir Senha</h2>
            <form onSubmit={handleResetPassword}>
                <input
                    type="password"
                    placeholder="Nova Senha"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />
                <button type="submit">Redefinir Senha</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default RedefinirSenha;
