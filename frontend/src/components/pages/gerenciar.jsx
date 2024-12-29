import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../css/gerenciar.css";
import "bootstrap/dist/css/bootstrap.min.css"; 
import { FaUser } from "react-icons/fa";
import { Helmet } from 'react-helmet-async'

const Gerenciar = () => {
    const [username, setUsername] = useState("");
    const [employee, setEmployee] = useState(null);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const employees = [
        { name: "João Silva", email: "joao@example.com", department: "TI", role: "Desenvolvedor", status: "Ativo" },
        { name: "Maria Oliveira", email: "maria@example.com", department: "Recursos Humanos", role: "Gerente", status: "Inativo" },
        { name: "João Santos", email: "joaosantos@example.com", department: "Vendas", role: "Representante", status: "Ativo" },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        const matches = employees.filter((emp) =>
            emp.name.toLowerCase().startsWith(username.toLowerCase())
        );
        if (matches.length > 0) {
            setFilteredEmployees(matches);
        } else {
            alert(`Nenhum funcionário encontrado com o nome: ${username}`);
        }
    };

    const handleSelectEmployee = (selectedEmployee) => {
        setEmployee(selectedEmployee);
        setShowModal(true);
    };

    const handleSave = () => {
        alert(`Informações de ${employee.name} foram atualizadas com sucesso!`);
        setShowModal(false);
    };

    return (
        <div className="geren-wrapper container fluid">
            <div className="row">
                <div className="col-md-3 sidebar-geren bg-light p-4">
                    <h4>AdminSR</h4>
                    <nav>
                        <ul className="nav flex-column">
                            <li className="nav-item">
                                <Link to="/admin" className="nav-link">Adicionar Funcionário</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/gerenciar" className="nav-link active">Gerenciar Funcionário</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/settings" className="nav-link">Configurações</Link>
                            </li>
                        </ul>
                    </nav>
                </div>
                <div className="col-md-9 geren-container p-4">
                    <h2>Gerenciar Funcionário</h2>
                    <p>
                        Bem-vindo à área de gerenciamento de funcionários. Aqui você pode visualizar todos os funcionários registrados, editar informações existentes ou remover acessos quando necessário.
                    </p>
                    <div className="geren-input-container mt-4">
                        <form onSubmit={handleSubmit} className="form-inline">
                            <div className="input-group">
                                <span className="input-group-text"><FaUser /></span>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Nome"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                                <button type="submit" className="btn btn-primary">
                                    Buscar
                                </button>
                            </div>
                        </form>
                    </div>
                    {filteredEmployees.length > 0 && (
                        <div className="mt-4">
                            <h4>Resultados da Pesquisa:</h4>
                            <ul className="list-group">
                                {filteredEmployees.map((emp, index) => (
                                    <li
                                        key={index}
                                        className="list-group-item d-flex justify-content-between align-items-center"
                                    >
                                        {emp.name}
                                        <button
                                            className="btn btn-sm btn-outline-primary"
                                            onClick={() => handleSelectEmployee(emp)}
                                        >
                                            Editar
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {showModal && (
                        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">Editar Funcionário</h5>
                                    </div>
                                    <div className="modal-body">
                                        <form>
                                            <div className="mb-3">
                                                <label className="form-label">Nome</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={employee.name}
                                                    onChange={(e) => setEmployee({ ...employee, name: e.target.value })}
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Email</label>
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    value={employee.email}
                                                    onChange={(e) => setEmployee({ ...employee, email: e.target.value })}
                                                />
                                            </div>
                                        </form>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-primary" onClick={handleSave}>
                                            Salvar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Gerenciar;
