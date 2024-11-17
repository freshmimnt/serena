import React from 'react';
import "../css/PainelAdmin.css"; 
import { Helmet } from 'react-helmet-async';

const AdicionarUsuario = () => {   
    return ( 
        <>
            <Helmet>
                <title>PainelAdmin</title>
            </Helmet>
            <header>   
                <h1>rice</h1>
            </header>    
                <nav class="menu-lateral">
                    <ul>
                        <li class="item-menu">
                            <a href="/add_user">                           
                                <span class="txt-link">Adicionar Funcionário</span>
                            </a>
                        </li>
                        <li class="item-menu">
                            <a href="/edit_user">                            
                                <span class="txt-link">Gerenciar Funcionários</span>
                            </a>
                        </li>
                        <li class="item-menu">
                            <a href="/settings">
                                <span class="txt-link">Importar Dados Externos</span>
                            </a>
                        </li>
                        <li class="item-menu">
                            <a href="/settings">
                                <span class="txt-link">Configurações</span>
                            </a>
                        </li>
                    </ul>
                </nav> 
            
            <div>
                <h2>
                    Adicionar Funcionário
                </h2>
                <h3>
                Use esta página para registrar novos funcionários na plataforma Serena. 
                Preencha os campos e, em seguida, envie as credenciais para o e-mail do funcionário.
                As credenciais geradas serão temporárias e poderão ser alteradas pelo próprio funcionário no primeiro acesso.
                </h3>
                <form action="">
                <div className="input-box">
                        <span><i class="bi bi-person"></i></span>
                        <input type="name" placeholder='Nome' required/>
                    </div>
                    <div className="input-box">
                        <span><i class="bi bi-envelope"></i></span>
                        <input type="email" placeholder='E-mail' required/>
                    </div>
                    <div className="input-box">
                        <span><i class="bi bi-lock"></i></span>
                        <input type="password" placeholder='Palavra-Passe' required/>
                    </div>
                </form>
            </div>
        </>
    );
}

export default AdicionarUsuario;
