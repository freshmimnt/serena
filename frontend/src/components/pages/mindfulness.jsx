import React, { useState, useEffect } from "react";
import "./Mindfulness.css";

const Mindfulness = () => {
    const [etapa, setEtapa] = useState(0);
    const [contador, setContador] = useState(10);

    const instrucoes = [
        "Sente-se em uma posição confortável e relaxe os ombros.",
        "Feche os olhos ou escolha um ponto fixo para focar sua visão.",
        "Inspire profundamente pelo nariz, sentindo o ar encher seus pulmões.",
        "Expire lentamente pela boca, liberando qualquer tensão.",
        "Preste atenção aos sons ao seu redor, sem julgá-los.",
        "Note como seu corpo está apoiado na cadeira ou no chão.",
        "Traga sua atenção de volta à sua respiração sempre que sua mente divagar.",
        "Quando estiver pronto, abra os olhos lentamente e volte ao momento presente.",
    ];

    useEffect(() => {
        if (contador > 0) {
            const timer = setInterval(() => {
                setContador((prev) => prev - 1);
            }, 1000);

            return () => clearInterval(timer);
        } else {
            setContador(10); 
            setEtapa((prev) => (prev + 1) % instrucoes.length); 
        }
    }, [contador]);

    
    useEffect(() => {
        const sintetizarFala = (texto) => {
            const utterance = new SpeechSynthesisUtterance(texto);
            utterance.lang = "pt-BR"; 
            utterance.rate = 0.9; 
            utterance.pitch = 0.5;
            window.speechSynthesis.speak(utterance);
        };

        sintetizarFala(instrucoes[etapa]); 
    }, [etapa]);

    return (
        <div className="mindfulness">
            <h1>Técnicas de Mindfulness</h1>
            <div className="instrucoes">
                <p>{instrucoes[etapa]}</p>
                <p className="contador">Próxima instrução em: {contador}s</p>
            </div>
        </div>
    );
};

export default Mindfulness;