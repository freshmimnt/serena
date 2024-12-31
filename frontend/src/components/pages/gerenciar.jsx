import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../css/gerenciar.css";
import "bootstrap/dist/css/bootstrap.min.css"; 
import { FaUser } from "react-icons/fa";
import { Helmet } from 'react-helmet-async'
import axios from "axios";

const Gerenciar = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [employee, setEmployee] = useState(null);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post("http://localhost:8000/api/searchEmployees", { name }, { withCredentials: true })
            .then((response) => {
                setFilteredEmployees(response.data); 
                alert("User encontrado");
            })
            .catch((error) => {
                console.error("Error fetching employees:", error);
                alert("Usuário não encontrado ou erro interno.");
            });
    };
    

    const handleSelectEmployee = (employee) => {
        setEmployee(employee);
        setShowModal(true);
    };

    const handleSave = async () => {
        try {
            const updatePayload = {
                userId: employee.user_id,
                ...(employee.name !== filteredEmployees.find(e => e.user_id === employee.user_id).name && { name: employee.name }),
                ...(employee.email !== filteredEmployees.find(e => e.user_id === employee.user_id).email && { email: employee.email }),
            };

            if (!Object.keys(updatePayload).length) {
                alert('No changes to save.');
                return;
            }

            await axios.post(
                "http://localhost:8000/api/updateEmployee",
                updatePayload,
                { withCredentials: true }
            );

            alert("Informações atualizadas com sucesso");
            setShowModal(false); 
        } catch (error) {
            console.error("Error updating employee:", error);
            alert("Erro ao atualizar funcionário. Tente novamente.");
        }
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
                        Bem-vindo à área de gerenciamento de funcionários. Aqui você pode visualizar todos os funcionários registrados, editar as suas informações e remover os funcionários quando necessário.
                    </p>
                    <div className="geren-input-container mt-4">
                        <form onSubmit={handleSubmit} className="form-inline">
                            <div className="input-group">
                                <span className="input-group-text"><FaUser /></span>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Nome"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
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
                                        {emp.email}
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
