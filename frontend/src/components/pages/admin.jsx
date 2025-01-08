import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/admin.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaUser, FaEnvelope } from "react-icons/fa";
import { Helmet } from 'react-helmet-async'
import axios from "axios";

const Admin = () => {

  const navigate = useNavigate(); 
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [values, setValues] = useState({
    name: "",
    email: "",      
  })

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      const response = await axios.post("http://localhost:8000/api/addEmployee", { name: values.name, email: values.email }, { withCredentials: true })
        if (response.status == 200){
          alert("Colaborador Adicionado")
      }else{
        alert("Não foi possível adicionar o colaborador")
      }
    }catch (error) {
      console.error("Login error:", error);
      if (error.response && error.response.status === 400) {
          alert("Validation error: Please check your input fields.");
      } else {
          alert("An error occurred. Please try again later.");
      }
    }
  };

  if (!isAuthenticated) {
    return null;
  }

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
                  onChange={e => setValues({...values, name: e.target.value})}
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
                  onChange={e => setValues({...values, email: e.target.value})}
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
