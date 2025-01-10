import React, { useState, useEffect } from "react";
import "../css/respiracao.css";

const Respiracao = () => {
    const [fase, setFase] = useState("Inspire");
    const [contador, setContador] = useState(4);

    useEffect(() => {
        const interval = setInterval(() => {
            if (contador > 1) {
                setContador((prev) => prev - 1);
            } else {
                switch (fase) {
                    case "Inspire":
                        setFase("Segure");
                        setContador(7);
                        break;
                    case "Segure":
                        setFase("Expire");
                        setContador(8);
                        break;
                    case "Expire":
                        setFase("Inspire");
                        setContador(4);
                        break;
                    default:
                        setFase("Inspire");
                        setContador(4);
                }
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [contador, fase]);

    return (
        <div className="exercicio-respiracao">
            <h1>Exercício de Respiração</h1>
            <p>Vamos relaxar e aliviar a ansiedade</p>
            <div className={`circulo ${fase.toLowerCase()}`}></div>
            <p>{fase}</p>
            <p>Tempo restante: {contador}s</p>
            
        </div>
    );
};

export default Respiracao;
 