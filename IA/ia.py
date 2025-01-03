import matplotlib.pyplot as plt
import networkx as nx
import random
import openai
import os
from flask import Flask, request, jsonify


# Configuração do servidor Flask
app = Flask(__name__)
openai.api_key = os.getenv('OPENAI_API_KEY')

# Definição dos estados e mensagens
states = {
    "inicio": [
        "Olá! Como você está se sentindo hoje? (responda com 'ansioso', 'triste', 'bem', 'sono', 'autoestima' ou 'sair')",
        "Oi, como está o seu dia hoje? Me conta, você está se sentindo ansioso, triste, bem, com problemas para dormir ou autoestima baixa?",
        "Oi! Estou aqui para ouvir você. Como você está se sentindo hoje? Ansioso, triste, bem, com dificuldades para dormir ou autoestima baixa?",
        "Olá! Como está o seu dia até agora? Está se sentindo ansioso, triste, bem, com problemas de sono ou precisa de ajuda com sua autoestima?",
        "Oi! Tudo bem por aí? Me conta: você está se sentindo ansioso, triste, bem, com dificuldades para dormir ou está precisando de um pouco de incentivo?",
        "Oi! Quero saber como você está hoje. Está ansioso, triste, bem, com dificuldades para dormir ou precisa de apoio com sua autoestima?"
    ],
    "ansioso": [
        "Sinto muito que você esteja se sentindo assim. Quer tentar um exercício de respiração?",
        "Eu entendo como a ansiedade pode ser difícil. Que tal tentarmos um exercício de respiração?",
        "Poxa, sinto muito que você esteja passando por isso. Posso te ajudar com um exercício de respiração para aliviar a ansiedade?",
        "Eu sei como a ansiedade pode ser complicada. Vamos tentar um exercício de respiração para ajudar você a se sentir um pouco melhor?",
        "Entendo que isso deve ser desconfortável. Que tal fazermos juntos um exercício de respiração para aliviar um pouco?",
        "Sei que a ansiedade pode ser difícil. Que tal fazermos um exercício de respiração juntos para acalmar um pouco?"

    ],
    "triste": [
        "Sinto muito que você esteja se sentindo assim. Quer conversar mais sobre isso?",
        "Eu lamento ouvir isso. Posso sugerir algumas dicas para melhorar seu humor?",
        "Eu lamento que você esteja passando por isso. Quer conversar ou ouvir algumas sugestões para melhorar um pouquinho o dia?",
        "Sei que a tristeza pode ser pesada, mas você não está sozinho(a). Posso te ajudar com algumas dicas ou só ouvir, se preferir.",
        "Eu lamento muito que você esteja se sentindo assim. Estou aqui para ajudar da forma que você precisar. Vamos conversar?",
        "Entendo que você está triste, e está tudo bem se sentir assim. Estou aqui para ajudar. Posso sugerir algo para melhorar ou só ouvir você?"
    ],
    "bem": [
        "Que bom saber que você está bem! Tem algo com o qual eu possa te ajudar hoje?",
        "Fico feliz por saber que você está bem! Algo específico que você gostaria de conversar?",
        "Que notícia boa saber que você está bem! Se quiser, estou aqui para qualquer coisa que precisar.",
        "Bom saber que você está bem! Tem algo que queira compartilhar ou perguntar?",
        "Fico contente por saber que você está bem! O que mais você gostaria de conversar hoje?"        
    ],
    "respiracao": [
        "Respire profundamente, segure a respiração por 7 segundos e depois expire devagar por 8 segundos. Como você se sente agora? Quer tentar mais uma vez?",
        "Vamos tentar respirar profundamente. Respire por 4 segundos, segure por 7 e expire por 8. Repetir mais vezes ajuda!",
        "Respirar devagar pode ajudar a aliviar a ansiedade. Inspire pelo nariz por 4 segundos, segure por 7 e solte o ar devagar por 8 segundos. Como está se sentindo agora? Posso te guiar mais vezes?",
        "Vamos tentar: respire fundo pelo nariz por 4 segundos, segure por 7 e expire lentamente pela boca por 8 segundos. Repetir ajuda a relaxar ainda mais. Quer continuar?",
        "Vamos lá: inspire pelo nariz por 4 segundos, segure a respiração por 7 segundos e expire lentamente pela boca por 8 segundos. É um ótimo jeito de acalmar a mente. Como se sente?",
        "Tudo bem, vamos juntos: inspire profundamente pelo nariz por 4 segundos, segure por 7, e solte o ar pela boca por 8 segundos. Como está se sentindo agora? Quer repetir mais algumas vezes?"

    ],
    "dicas": [
        "Experimente sair para dar uma caminhada ou ouvir uma música relaxante. Algo mais que eu possa sugerir?",
        "Que tal tentar ouvir uma música que você goste ou tomar um ar fresco?"
    ],
    "sono": [
        "Como você está dormindo ultimamente? Tem enfrentado dificuldades?",
        "Problemas para dormir podem ser complicados. Posso sugerir algumas dicas para melhorar o sono?"
    ],
    "autoestima": [
        "A autoestima é essencial! Que tal listar 3 coisas que você gosta em você?",
        "Às vezes, precisamos ser mais gentis conosco. Posso te ajudar com isso?"
    ],
    "depressao": [
        "Sinto muito que você esteja se sentindo assim. Já pensou em procurar ajuda profissional?",
        "A depressão pode ser muito difícil. Posso sugerir algumas estratégias para lidar com isso?"
    ],
    "stress": [
        "Parece que você está lidando com muito estresse. Que tal tentarmos um exercício de relaxamento?",
        "O estresse pode ser desgastante. Posso sugerir algumas atividades para aliviar esse sentimento?"
    ],
    "frustracao": [
        "Parece que você está frustrado. Que tal falar mais sobre o que está acontecendo?",
        "A frustração pode ser difícil de lidar. Como posso te ajudar a superar isso?"
    ],
    "solidao": [
        "A solidão pode ser muito desafiadora. Quer falar sobre como você tem se sentido?",
        "Você não está sozinho. Às vezes, conversar pode ajudar. O que você gostaria de compartilhar?"
    ],
    "medo": [
        "O medo é uma emoção normal, mas pode ser paralisante. O que está te assustando agora?",
        "Eu entendo que o medo pode ser assustador. Quer tentar um exercício para lidar com ele?"
    ],
    "culpa": [
        "Você está se sentindo culpado? Isso pode ser um sentimento pesado. Quer falar sobre isso?",
        "A culpa pode ser muito dolorosa. Talvez possamos tentar entender de onde vem esse sentimento."
    ],
    "ansiedade_social": [
        "Eu entendo que situações sociais podem ser estressantes. Como posso ajudar?",
        "A ansiedade social pode ser muito difícil. Você gostaria de tentar algumas dicas para lidar com isso?"
    ],
    "transtorno_obsessivo": [
        "Eu sei que o TOC pode ser desafiador. Já procurou um profissional para ajudar com isso?",
        "As obsessões e compulsões podem ser muito difíceis de controlar. Como posso te ajudar?"
    ],
    "distorcao_cognitiva": [
        "Às vezes, nossos pensamentos nos enganam. Você já tentou observar esses padrões de pensamento?",
        "As distorções cognitivas podem ser prejudiciais. Vamos tentar mudar a forma como você vê a situação?"
    ],
    "tristeza_geral": [
        "Você está sentindo tristeza de forma geral? Falar sobre isso pode ajudar.",
        "A tristeza pode se acumular ao longo do tempo. Quer compartilhar o que está causando isso?"
    ],
    "raiva": [
        "A raiva é uma emoção normal, mas pode ser destrutiva. O que está causando essa raiva?",
        "Lidar com a raiva pode ser desafiador. Quer tentar uma técnica de liberação emocional?"
    ],
    "culpa_procrastinacao": [
        "Se sentir culpado pela procrastinação é comum. O que você acha que está impedindo você de agir?",
        "A procrastinação pode gerar culpa, mas entender suas causas ajuda. Quer explorar isso?"
    ],
    "esgotamento": [
        "Você está se sentindo esgotado? Talvez seja hora de fazer uma pausa. Como posso te ajudar?",
        "O esgotamento pode ser causado por várias razões. Você tem conseguido descansar o suficiente?"
    ],
    "ansiedade_geral": [
        "A ansiedade geral pode ser desgastante. Já tentou técnicas de mindfulness?",
        "Entendo que a ansiedade generalizada pode afetar muitas áreas da sua vida. O que está mais difícil agora?"
    ],
    "depressao_geral": [
        "A depressão pode se manifestar de diversas formas. Como você tem se sentido nos últimos dias?",
        "Se você está lutando contra a depressão, é importante pedir apoio. Como posso ajudar?"
    ],
    "transtorno_alimentar": [
        "Transtornos alimentares são muito difíceis de lidar sozinho. Você já pensou em procurar um terapeuta?",
        "Se você está lidando com um transtorno alimentar, é importante buscar ajuda. O que você gostaria de compartilhar?"
    ],
    "reconhecer_sentimentos": [
        "Você tem dificuldade em reconhecer seus sentimentos? Podemos tentar uma abordagem para isso.",
        "Entender como nos sentimos é o primeiro passo para lidar com isso. O que você está sentindo agora?"
    ],
    "excessiva_autocrítica": [
        "Você tem sido muito autocrítico? Isso pode ser difícil de lidar. Posso te ajudar a mudar esse padrão?",
        "A autocrítica excessiva pode ser prejudicial. Vamos tentar ser mais gentis com você mesmo?"
    ],
    "fobias": [
        "As fobias podem ser paralisantes. Já pensou em enfrentá-las de forma gradual?",
        "Lidar com fobias pode ser assustador, mas existem métodos que podem ajudar. Como posso ajudar?"
    ],
    "estigma_psiquiatrico": [
        "O estigma em relação à saúde mental ainda existe, mas é importante lembrar que buscar ajuda é uma força.",
        "Muitas pessoas enfrentam estigmas relacionados a distúrbios mentais. Eu te apoio nessa jornada."
    ],
    "relacionamentos": [
        "Você está lidando com dificuldades nos relacionamentos? Como posso ajudar?",
        "Relacionamentos podem ser desafiadores. O que está acontecendo na sua vida agora?"
    ],
    "preocupacao_excessiva": [
        "Preocupar-se excessivamente pode ser desgastante. Vamos tentar acalmar sua mente.",
        "O que mais tem te preocupado ultimamente? Talvez possamos trabalhar isso juntos."
    ],
    "isolamento_social": [
        "Você tem se isolado? Às vezes, precisamos de apoio social. Como posso ajudar?",
        "O isolamento social pode piorar os sentimentos de solidão. Já pensou em conversar com alguém?"
    ],
    "vulnerabilidade_emocional": [
        "Se sentir vulnerável é normal em certos momentos. Como posso te apoiar agora?",
        "Ser emocionalmente vulnerável pode ser uma oportunidade de crescimento. Vamos explorar isso?"
    ],
    "superar_traumas": [
        "Traumas podem ser difíceis de superar. Já pensou em trabalhar isso com um terapeuta?",
        "Superar traumas leva tempo. Eu posso te ajudar a lidar com os sentimentos ao longo desse processo."
    ],
    "autoaceitacao": [
        "Aceitar a si mesmo pode ser difícil, mas é essencial para o bem-estar. O que você acha de tentar se amar mais?",
        "A autoaceitação é uma jornada. O que você pode começar a fazer para se aceitar mais?"
    ],
    "autoestima_abaixo": [
        "A autoestima baixa pode ser prejudicial. Que tal começarmos a trabalhar nisso?",
        "Você merece se sentir bem consigo mesmo. Vamos pensar em maneiras de aumentar sua autoestima?"
    ],
    "reconhecer_fechamento_emocional": [
        "Você está se fechando emocionalmente? Isso pode dificultar a conexão com os outros. Vamos falar mais sobre isso?",
        "Reconhecer quando estamos nos fechando emocionalmente é um primeiro passo importante. O que você acha?"
    ],
    "aceitar_ajuda": [
        "Aceitar ajuda pode ser difícil, mas é importante. Como posso apoiar você nesse processo?",
        "Você não precisa enfrentar isso sozinho. Estou aqui para ajudar. O que você gostaria de fazer a seguir?"
    ],
    "enfrentar_inseguranca": [
        "Insegurança é algo que todos enfrentam em algum momento. O que está gerando insegurança para você?",
        "Enfrentar a insegurança pode ser um grande desafio. Podemos começar a trabalhar nisso juntos."
    ],
    "sentimento_de_adequacao": [
        "Você se sente adequado em suas ações e decisões? Às vezes, precisamos trabalhar para nos sentir mais confiantes.",
        "O sentimento de adequação é importante para o bem-estar emocional. Como posso te ajudar a alcançar isso?"
    ],
    "final": [
        "Foi ótimo conversar com você! Se precisar de ajuda novamente, estarei aqui. Até logo!",
        "Espero que nossa conversa tenha ajudado de alguma forma. Cuide-se bem e lembre-se de que sempre estarei aqui para você. Até breve!",
        "Obrigado por compartilhar um pouco do seu tempo comigo. Estarei aqui sempre que precisar conversar. Fique bem!",
        "Lembre-se de que não está sozinho. Se precisar de apoio, estarei sempre por perto. Tenha um ótimo dia!"
    ]
}


# Definição das transições entre estados
transitions = {
    "inicio": {
        "ansioso": "ansioso", "triste": "triste", "bem": "bem", "sono": "sono",
        "autoestima": "autoestima", "depressao": "depressao", "stress": "stress",
        "frustracao": "frustracao", "solidao": "solidao", "medo": "medo",
        "culpa": "culpa", "ansiedade_social": "ansiedade_social",
        "transtorno_obsessivo": "transtorno_obsessivo", "distorcao_cognitiva": "distorcao_cognitiva",
        "tristeza_geral": "tristeza_geral", "raiva": "raiva",
        "culpa_procrastinacao": "culpa_procrastinacao", "esgotamento": "esgotamento",
        "ansiedade_geral": "ansiedade_geral", "depressao_geral": "depressao_geral",
        "transtorno_alimentar": "transtorno_alimentar", "reconhecer_sentimentos": "reconhecer_sentimentos",
        "excessiva_autocrítica": "excessiva_autocrítica", "fobias": "fobias",
        "estigma_psiquiatrico": "estigma_psiquiatrico", "relacionamentos": "relacionamentos",
        "preocupacao_excessiva": "preocupacao_excessiva", "isolamento_social": "isolamento_social",
        "vulnerabilidade_emocional": "vulnerabilidade_emocional",
        "superar_traumas": "superar_traumas", "autoaceitacao": "autoaceitacao",
        "autoestima_abaixo": "autoestima_abaixo", "reconhecer_fechamento_emocional": "reconhecer_fechamento_emocional",
        "aceitar_ajuda": "aceitar_ajuda", "enfrentar_inseguranca": "enfrentar_inseguranca",
        "sentimento_de_adequacao": "sentimento_de_adequacao"
    },
    "ansioso": {"sim": "respiracao", "não": "final"
    },
    "triste": { "sim": "dicas", "não": "final"
    },
    "bem": {"sim": "inicio", "não": "final"
    },
    "respiracao": {"sim": "inicio", "não": "final"
    },
    "dicas": { "sim": "inicio", "não": "final"
    },
    "sono": { "sim": "inicio", "não": "final"
    },
    "autoestima": { "sim": "inicio","não": "final"
    },
    "depressao": { "sim": "triste",  "não": "final"
    },
    "stress": {"sim": "inicio", "não": "final"
    },
    "frustracao": {"sim": "inicio", "não": "final"
    },
    "solidao": {"sim": "inicio", "não": "final"
    },
    "medo": {"sim": "inicio","não": "final"
    },
    "culpa": {"sim": "inicio", "não": "final"
    },
    "ansiedade_social": {"sim": "inicio",  "não": "final"
    },
    "transtorno_obsessivo": {"sim": "inicio", "não": "final"
    },
    "distorcao_cognitiva": { "sim": "inicio", "não": "final"
    },
    "tristeza_geral": { "sim": "inicio", "não": "final"
    },
    "raiva": {"sim": "inicio", "não": "final"
    },
    "culpa_procrastinacao": {"sim": "inicio", "não": "final"
    },
    "esgotamento": { "sim": "inicio", "não": "final"
    },
    "ansiedade_geral": {"sim": "inicio", "não": "final"
    },
    "depressao_geral": {"sim": "inicio", "não": "final"
    },
    "transtorno_alimentar": { "sim": "inicio",   "não": "final"
    },
    "reconhecer_sentimentos": {"sim": "inicio", "não": "final"
    },
    "excessiva_autocrítica": {"sim": "inicio",  "não": "final"
    },
    "fobias": {"sim": "inicio", "não": "final"
    },
    "estigma_psiquiatrico": {"sim": "inicio",  "não": "final"
    },
    "relacionamentos": {"sim": "inicio",  "não": "final"
    },
    "preocupacao_excessiva": {"sim": "inicio", "não": "final"
    },
    "isolamento_social": {"sim": "inicio", "não": "final"
    },
    "vulnerabilidade_emocional": {"sim": "inicio", "não": "final"
    },
    "superar_traumas": {"sim": "inicio", "não": "final"
    },
    "autoaceitacao": {"sim": "inicio", "não": "final"
    },
    "autoestima_abaixo": {"sim": "inicio", "não": "final"
    },
    "reconhecer_fechamento_emocional": { "sim": "inicio", "não": "final"
    },
    "aceitar_ajuda": {"sim": "inicio", "não": "final"
    },
    "enfrentar_inseguranca": {"sim": "inicio", "não": "final"
    },
    "sentimento_de_adequacao": {"sim": "inicio", "não": "final"
    }
}


# Histórico detalhado
history = []

# Função para analisar sentimentos
def analyze_sentiment(user_input):
    if any(word in user_input for word in ["não", "triste", "difícil", "ansioso"]):
        return "negativo"
    elif any(word in user_input for word in ["sim", "bem", "feliz", "ótimo"]):
        return "positivo"
    else:
        return "neutro"
    
# Função para responder com mais empatia
def empathy_response(sentiment, response):
    if sentiment == "negativo":
        response = "Eu sei que pode estar sendo difícil. " + response
    elif sentiment == "positivo":
        response = "Fico muito feliz que você esteja se sentindo melhor! " + response
    else:
        response = response
    return response

#Funçao openai
def generate_openai_response(user_input):
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo", 
            messages=[{"role": "user", "content": user_input}],
        )
        return response['choices'][0]['message']['content']
    except Exception as e:
        return f"Ocorreu um erro ao tentar gerar uma resposta: {str(e)}"



# Função pra gerar um gráfico das emocoes, colegas ainda naii tenho certeza se isso fica
def generate_emotion_graph():
    G = nx.DiGraph()
    for interaction in history:
        G.add_edge(interaction["state"], interaction["user_input"])
    nx.draw(G, with_labels=True, node_color="lightblue", font_size=10, node_size=2000)
    if not os.path.exists("static"):
        os.mkdir("static")
    plt.savefig("static/emotion_graph.png")
    plt.close()


@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    current_state = data.get("state", "inicio")
    user_input = data.get("message", "").strip().lower()

    # Caso o usuário queira sair
    if user_input == "sair":
        generate_emotion_graph()
        return jsonify({"response": "Adeus! Cuide-se e volte quando precisar."})

    # Análise de sentimento
    sentiment = analyze_sentiment(user_input)
    response = random.choice(states[current_state])
    response = empathy_response(sentiment, response)

    # atualizaa o historico
    history.append({"state": current_state, "user_input": user_input})

    # Verifica a transiçao de estado
    next_state = transitions.get(current_state, {}).get(user_input, "final")
    
    if next_state == "final":
        response = random.choice(states["final"])
    else:
        # Se for necessario usar o OpenAI para gerar uma resposta
        if next_state in ["ansioso", "triste", "autoestima", "depressao", "stress"]:
            openai_response = generate_openai_response(user_input)
            response = empathy_response(sentiment, openai_response)
        else:
            response = random.choice(states.get(next_state, ["final"]))

    # Atualiza o estado atual no histórico
    history.append({"state": next_state, "user_input": user_input})

    # Verifica se é o momento de gerar o gráfico
    if len(history) % 10 == 0:  
        generate_emotion_graph()

    return jsonify({"response": response, "next_state": next_state})
    
# Função para iniciar o servidor Flask
def start_server():
    app.run(host="0.0.0.0", port=5000)

# aqui inicia o servidor
if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
