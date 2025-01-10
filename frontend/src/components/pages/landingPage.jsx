import React, { useRef } from 'react';
import { Link } from 'react-router-dom'; 
import "../css/LandingPage.css";
import Footer from './footer';

const LandingPage = () => {
  const footerRef = useRef(null);
  const serviçoRef = useRef(null);
  const sobreRef = useRef(null);

  

  const scrollToSection = (ref) => (e) => {
    e.preventDefault(); 
    ref.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      
      <div className='header'>
        <header className='header-content'>
          <Link to="/" > <img src="src/assets/Logo.png" alt="Logo" /></Link>
          <nav>
            <ul>
              <li>
                <Link to="#" onClick={scrollToSection(serviçoRef)}>Serviço</Link>
              </li>
              <li>
                <Link to="#" onClick={scrollToSection(sobreRef)}>Sobre</Link>
              </li>
              <li>
                <Link to="#" onClick={scrollToSection(footerRef)}>Contactos</Link>
              </li>
              <li>
                <Link to="/login">Login</Link>
              </li>
            </ul>
          </nav>
        </header>
      </div>
      <div className='home'>
        <div className='text-container'>
          <h1>SR</h1>
          <h2>Sitema de</h2>
          <h2>suporte</h2>
          <h2>emocional</h2>
          <h2>com IA</h2>
          <img src="src/assets/home.png" alt="Imagem Home" />
        </div>
      </div>
      
      <div className='servico'>
        <div className='text-servico'>
          <div ref={serviçoRef} >          
            <h1>Suporte emocional inteligente para empresas que valorizam o bem-estar.</h1>
            <p>Nossa solução vai além de cuidar do bem-estar mental dos seus colaboradores. O software Serena combina tecnologia de ponta e empatia para fornecer um acompanhante contínuo e personalizado, promovendo um ambiente de trabalho mais saudável e produtivo.</p>
          </div>
        </div>
        <div className='imagem-grupo'>
          <img src="src/assets/grupo1.png" alt="Imagem Grupo pessoas" />
          <img src="src/assets/grupo2.png" alt="Imagem Grupo pessoas" />
          <img src="src/assets/grupo3.png" alt="Imagem Grupo pessoas" />
        </div>

        <div className='text-container-grupos'>
          <div className='text-grupo1'>
            <h3>Redução de Faltas e Afastamentos</h3>
            <h4>Menos ausências, mais resultados</h4>
            <p>Investir na saúde mental reduz significativamente o absenteísmo e os afastamentos por motivos emocionais. Com o apoio contínuo da Serena, os colaboradores se sentem acolhidos e cuidados, diminuindo a necessidade de ausências e afastamentos.</p>
          </div>
          <div className='text-grupo2'>
            <h3>Aumento da Produtividade</h3>
            <h4>Funcionários Felizes, empresa eficiente.</h4>
            <p>Colaboradores com boa saúde mental são mais focados, criativos e comprometidos com suas tarefas. Com o apoio emocional oferecido pela Serena, reduzimos o estresse, promovemos concentração e aumentamos a produtividade.</p>
          </div>
          <div className='text-grupo3'>
            <h3>Melhoria do Ambiente de Trabalho</h3>
            <h4>Crie uma cultura organizada saudável</h4>
            <p>Um ambiente de trabalho que prioriza a saúde mental promove cultura organizacional positiva, colaborativa e inovadora. Ao adotar a Serena, sua empresa se posiciona como uma organização que cuida e valoriza seus colaboradores.</p>
          </div>
        </div>

        <div className='box-text'>
            <div className='box-demo'>
              <h2>Experimente Serena Gratuitamente</h2>
              <p>Peça uma demonstração e veja como nossa plataforma pode transformar o ambiente de trabalho em sua empresa. Sem compromisso, você poderá entender na prática como o suporte emocional inteligente pode gerar resultados imediatos.</p>
              <Link to="/demo"><button>Pedir Demo</button></Link>
            </div>
            <div className='box-compra'>
              <h2>Invista no Futuro da Sua Empresa</h2>
              <p>Garanta o bem-estar e o desempenho
              do seu time com uma solução que já impacta positivamente diversas organizações. Não perca mais tempo – dê o próximo passo para criar um ambiente de trabalho saudável e motivador.</p>             
              <Link to="/comprar"><button>Comprar Serviço</button></Link>
            </div>
        </div>

      </div>

      
      <div ref={sobreRef} >
          <div className='text-sobre'>
            <img src="src/assets/sobre.webp" alt="Imagem Sobre" />
            <div className='text-content'> 
                <h1>Sobre a Serena</h1>
                <p>A Serena é uma plataforma inovadora que apoia a saúde mental no ambiente de trabalho. Nossa missão é promover o bem-estar emocional dos colaboradores por meio de atendimento psicológico personalizado, disponível 24/7.
                  Com inteligência artificial, a Serena se adapta às necessidades individuais, ajudando os funcionários a gerenciar o estresse e aumentar a produtividade, seja no escritório, home office ou qualquer outro trabalho. Priorizamos a confidencialidade e a segurança dos dados, criando um espaço seguro para buscar apoio.
                  Ao escolher a Serena, sua empresa investe em um ambiente de trabalho mais saudável e produtivo. Junte-se a nós na transformação do cuidado com a saúde mental e ofereça o suporte que sua equipe merece.</p>
            </div>
        </div>
        <div className='final'>          
          <h1>"Terapia com IA: Inovação para o bem-estar emocional."</h1>
        </div>
      </div>

     
      <Footer ref={footerRef} />
    </div>
  );
};

export default LandingPage;