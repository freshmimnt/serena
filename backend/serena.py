import matplotlib.pyplot as plt
import networkx as nx


#http.post 80002

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



# Criar o grafo
G = nx.DiGraph()

# Adicionar os nós e transições ao grafo
for state, message in states.items():
    G.add_node(state, label=message)

for state, edges in transitions.items():
    for user_input, next_state in edges.items():
        G.add_edge(state, next_state, label=user_input)

# Gerar layout
pos = nx.spring_layout(G, seed=42)

# Desenhar o grafo
plt.figure(figsize=(12, 8))
nx.draw(G, pos, with_labels=True, node_size=3000, node_color="lightblue", font_size=10, font_weight="bold", edge_color="gray")

# Adicionar labels às arestas
edge_labels = nx.get_edge_attributes(G, 'label')
nx.draw_networkx_edge_labels(G, pos, edge_labels=edge_labels, font_size=8)

plt.title("Árvore de Estados do Chatbot", fontsize=14, fontweight="bold")
plt.axis("off")
plt.show()



def chatbot():
    # Estado inicial
    current_state = "inicio"
    # Histórico de conversa
    history = []
    
    print(states[current_state])  # Mensagem inicial

    while current_state != "final":
        # Ler entrada do utilizador
        user_input = input("> ").strip().lower()
        
        # Permitir saída forçada
        if user_input == "sair":
            print("Adeus! Cuida de ti.")
            break
        
        # Validar entrada e realizar transição
        if user_input in transitions[current_state]:
            history.append((current_state, user_input))  # Guardar histórico
            current_state = transitions[current_state][user_input]
            print(states[current_state])
        else:
            print("Desculpa, não entendi. Podes repetir?")

    # Mostrar histórico no final (para feedback ou debug)
    print("\nHistórico de Conversa:")
    for state, response in history:
        print(f"{state} -> {response}")

# Iniciar o chatbot
chatbot()








