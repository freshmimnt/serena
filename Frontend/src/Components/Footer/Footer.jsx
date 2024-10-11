import React, { forwardRef } from "react";
import { Link } from "react-router-dom";
import { FaInstagram, FaTwitter, FaFacebookF } from "react-icons/fa";
import "./Footer.css";

const Footer = forwardRef((props, ref) => {
    return (
        <footer className="footer_container" ref={ref}>
            <div className="text">
                <h2>Aviso Legal</h2>
                <p>A Serena foi projetada para oferecer suporte à saúde mental, e pode ser utilizada em situações de crise de ansiedade, estresse entre outros. Contudo, é importante ressaltar que a plataforma não substitui acompanhamento médico e clínico, não deve ser usado em casos de abusos, condições graves de saúde mental que possam resultar em pensamentos suicidas, automutilação ou outras emergências médicas. Embora a Serena possa ajudar a gerenciar crises emocionais, é fundamental buscar ajuda profissional qualificada.</p>
            </div>

            <div className="links_container">
                <div className="links_section">
                    <h2>Links úteis</h2>
                    <ul>
                        <li>
                            <a href="/" target="_blank" rel="noopener noreferrer">Psicólogo</a>
                        </li>
                        <li>
                            <a href="/" target="_blank" rel="noopener noreferrer">Psiquiatria</a>
                        </li>
                        <li>
                            <a href="/" target="_blank" rel="noopener noreferrer">Linha de Apoio</a>
                        </li>
                    </ul>
                </div>

                <div className="links_section">
                    <h2>Fale conosco</h2>
                    <ul>
                        <li>
                            <a href="mailto:hello@serena.com">hello@serena.com</a>
                        </li>
                    </ul>
                </div>

                <div className="clic_midia">
                    <h2>Siga-nos</h2>
                    <div className="social_icons">
                        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                            <FaInstagram />
                        </a>
                        <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
                            <FaTwitter />
                        </a>
                        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                            <FaFacebookF />
                        </a>
                    </div>
                </div>
            </div>

            <div className="direitos">
                © 2024 SerenaAI - Todos os direitos reservados.
            </div>
        </footer>
    );
});

export default Footer;
