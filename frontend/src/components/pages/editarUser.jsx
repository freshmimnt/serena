import React from 'react';
import "../css/PainelAdmin.css"; 
import { Helmet } from 'react-helmet-async';

const EditarUsuario = () => {
    
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
        </>
    );
}

export default EditarUsuario;