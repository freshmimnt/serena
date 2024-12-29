import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../css/adminSettings.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaUser, FaEnvelope, FaCalendarAlt, FaUsers } from "react-icons/fa";
import { Helmet } from 'react-helmet-async'
import axios from "axios";

const AdminSettings = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [employeeCount, setEmployeeCount] = useState(""); 
  const [daysLeft, setDaysLeft] = useState(""); 

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated Profile:", { email, password });
    alert(`Informações do administrador foram atualizadas com sucesso!`);
    setEmail("");
    setPassword("");
  };

  const handleLogout = () => {
    axios.get("http://localhost:8000/api/logout")
      .then(() => {
        window.location.href = "/";
      })
      .catch((error) => {
        console.error("Logout error:", error);
      });
  };  

  useEffect (() => {
    axios.get("http://localhost:8000/api/numberOfEmployees", { withCredentials: true })
    .then((response) =>{
      setEmployeeCount(response.data.employeeCount);
    })
    .catch((error) => console.error('Error fetching user details:', error))
  }, [])

  useEffect (() => {
    axios.get("http://localhost:8000/api/daysLeft", { withCredentials: true })
    .then((response) =>{
      setDaysLeft(response.data.daysLeft);
    })
    .catch((error) => console.error('Error fetching user details:', error))
  }, [])

  return (
    <div className="setting-wrapper container-fluid">
      <div className="row">
        <div className="col-md-3 sidebar-setting bg-light p-4">
          <h4>AdminSR</h4>
          <nav>
            <ul className="nav flex-column">
              <li className="nav-item">
                <Link to="/admin" className="nav-link">Adicionar Funcionário</Link>
              </li>
              <li className="nav-item">
                <Link to="/gerenciar" className="nav-link">Gerenciar Funcionário</Link>
              </li>
              <li className="nav-item">
                <Link to="/settings" className="nav-link active">Configurações</Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="col-md-9 setting-container p-4">
          <h2>Configurações</h2>
          <p>
            Aqui, nas Configurações, você pode facilmente editar seu nome, e-mail e visualizar quantos funcionários estão registrados. Além disso, você pode verificar quanto tempo resta até a expiração da sua licença e entrar em contato com a equipe de suporte.
          </p>

          <div className="info-section mt-4">
            <h5><FaCalendarAlt /> Expiração da Licença:</h5>
            <p>{daysLeft}</p>

            <h5><FaUsers /> Funcionários Registrados:</h5>
            <p>{employeeCount}</p>
          </div>

          <div className="setting-input-container mt-5">
            <h4>Editar Perfil</h4>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <div className="input-group">
                  <span className="input-group-text"><FaUser /></span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Password</label>
                <div className="input-group">
                  <span className="input-group-text"><FaEnvelope /></span>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <button type="submit" className="settings btn btn-primary">
                Atualizar Informações
              </button>
              <p></p>
              <button onClick={handleLogout} className="settings btn btn-primary">
                Encerrar sessão
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
