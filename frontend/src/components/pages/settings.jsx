import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../css/adminSettings.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaUser, FaEnvelope, FaCalendarAlt, FaUsers } from "react-icons/fa";
import { Helmet } from 'react-helmet-async'
import axios from "axios";

const AdminSettings = () => {
  const [newEmail, setNewEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [employeeCount, setEmployeeCount] = useState(""); 
  const [daysLeft, setDaysLeft] = useState(""); 

  const handleChangePassword = (e) => {
    e.preventDefault();
    axios.post("http://localhost:8000/api/changeCompanyPassword", { oldPassword, newPassword }, { withCredentials: true })
      .then(() => {
        alert("Senha alterada com sucesso");
      })
      .catch((error) => {
        console.error("Change password error:", error);
        alert("Não foi possível alterar a senha. Tente novamente mais tarde.");
        })
    };
    const handleChangeEmail = (e) => {
      e.preventDefault();
      axios.post("http://localhost:8000/api/changeCompanyEmail", { newEmail }, { withCredentials: true })  
        .then(() => {
          alert("Email alterado com sucesso");
        })
        .catch((error) => {
          console.error("Change email error:", error);
          alert("Não foi possível alterar o email. Tente novamente mais tarde.");
          })
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
            <form onSubmit={handleChangeEmail}>
              <h5>Email</h5>
              <div className="mb-3">
                <div className="input-group">
                  <span className="input-group-text"><FaUser /></span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Introduza o seu novo newEmail"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                  />
                </div>
              </div>
              <button type="submit" className="settings btn btn-primary">
                Atualizar Email
              </button>
            </form>
            <hr />  
            <form onSubmit={handleChangePassword}>
              <h5>Password</h5>
              <div className="mb-3">
                <div className="input-group">
                  <span className="input-group-text"><FaEnvelope /></span>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Antiga Password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                </div>
              </div>
              <div className="mb-3">
                <div className="input-group">
                  <span className="input-group-text"><FaEnvelope /></span>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Nova password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
              </div>
              <button type="submit" className="settings btn btn-primary">
                Atualizar Password
              </button>
            </form>
              <hr />
              <button onClick={handleLogout} className="settings btn btn-primary">
                Encerrar sessão
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
