import matplotlib.pyplot as plt
import networkx as nx
from flask import Flask, request, jsonify

# Configuração do servidor Flask
app = Flask(__name__)

# Definição dos estados e mensagens
states = {
    "inicio": "Olá! Como te sentes hoje? (responde com 'ansioso', 'triste' ou 'bem'). Escreve 'sair' para terminar a conversa.",
    "ansioso": "Sinto muito que te sintas assim. Queres fazer um exercício de respiração? (sim/não)",
    "triste": "Lamento ouvir isso. Gostarias de algumas dicas para melhorar o teu humor? (sim/não)",
    "bem": "Fico contente por saber disso! Precisas de alguma ajuda ou estás só a explorar? (sim/não)",
    "respiracao": "Vamos lá! Respira fundo pelo nariz durante 4 segundos, segura a respiração por 7 segundos e expira pela boca por 8 segundos. Repete isso 5 vezes. Algo mais em que te possa ajudar? (sim/não)",
    "dicas": "Experimenta ouvir uma música que gostes, sair para apanhar ar fresco ou ligar a alguém de confiança. Mais alguma coisa? (sim/não)",
    "final": "Foi um prazer falar contigo! Cuida de ti e até à próxima!",
}

# Definição das transições entre estados
transitions = {
    "inicio": {"ansioso": "ansioso", "triste": "triste", "bem": "bem"},
    "ansioso": {"sim": "respiracao", "não": "final"},
    "triste": {"sim": "dicas", "não": "final"},
    "bem": {"sim": "inicio", "não": "final"},
    "respiracao": {"sim": "inicio", "não": "final"},
    "dicas": {"sim": "inicio", "não": "final"},
}

# Histórico de conversas (simples, para fins de demonstração)
history = []

@app.route('/chat', methods=['POST'])
def chat():
    # Receber dados do cliente
    data = request.json
    current_state = data.get("state", "inicio")
    user_input = data.get("message", "").strip().lower()

    # Validar entrada e realizar transição
    if user_input == "sair":
        return jsonify({"response": "Adeus! Cuida de ti.", "state": "final"})

    if user_input in transitions.get(current_state, {}):
        next_state = transitions[current_state][user_input]
        response = states[next_state]
        history.append((current_state, user_input))  # Guardar histórico
        return jsonify({"response": response, "state": next_state})
    else:
        return jsonify({"response": "Desculpa, não entendi. Podes repetir?", "state": current_state})


# Função para iniciar o servidor Flask
def start_server():
    app.run(host="0.0.0.0", port=5000)

# Iniciar o servidor
if __name__ == "__main__":
    start_server()
