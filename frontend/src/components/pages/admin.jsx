import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../css/admin.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaUser, FaEnvelope } from "react-icons/fa";
import { Helmet } from 'react-helmet-async'

const Admin = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username || !email) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    console.log("Submitted:", { username, email });
    alert(`Funcionário ${username} foi adicionado com sucesso!`);

    // Reset form
    setUsername("");
    setEmail("");
  };

  return (
    <div className="admin-wrapper container-fluid">
      <div className="row">
        <div className="col-md-3 sidebar-setting bg-light p-4">
          <h4>AdminSR</h4>
          <nav>
            <ul className="nav flex-column">
              <li className="nav-item">
                <Link to="/admin" className="nav-link active">
                  Adicionar Funcionário
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/gerenciar" className="nav-link">
                  Gerenciar Funcionário
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/settings" className="nav-link">
                  Configurações
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="admin-container">
          <h2>Adicionar Funcionário</h2>
          <p>
            Use esta página para registrar novos funcionários na plataforma
            Serena. Preencha os campos e, em seguida, envie as credenciais para
            o e-mail do funcionário. As credenciais geradas serão temporárias e
            poderão ser alteradas pelo próprio funcionário no primeiro acesso.
          </p>

          <div className="admin-input-container">
            <form onSubmit={handleSubmit}>
              <div className="admin-input input-group mb-3">
                <span className="input-group-text">
                  <FaUser />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nome"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  aria-label="Nome"
                  required
                />
              </div>

              <div className="admin-input input-group mb-3">
                <span className="input-group-text">
                  <FaEnvelope />
                </span>
                <input
                  type="email"
                  className="form-control"
                  placeholder="E-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-label="E-mail"
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary w-100">
                Adicionar
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
