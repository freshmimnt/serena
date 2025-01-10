import matplotlib.pyplot as plt
import networkx as nx
import random
from flask import Flask, request, jsonify


app = Flask(__name__)


states = {
    "inicio": [
        "Olá! Como você está se sentindo hoje? (responda com 'ansioso', 'triste', 'bem', 'sono', 'autoestima' ou 'sair')",
        "Oi, como está o seu dia hoje? Me conta, você está se sentindo ansioso, triste, bem, com problemas para dormir ou autoestima baixa?",
        "Oi! Estou aqui para ouvir você. Como você está se sentindo hoje? Ansioso, triste, bem, com dificuldades para dormir ou autoestima baixa?",
        "Oi! Tudo bem? Como você está se sentindo hoje? Ansioso, triste, bem ou com algum problema específico?",
    ],
    "ansioso": [
        "Sinto muito que você esteja se sentindo assim. Quer tentar um exercício de respiração?",
        "Eu entendo como a ansiedade pode ser difícil. Que tal tentarmos um exercício de respiração?",
        "Poxa, sinto muito que você esteja passando por isso. Posso te ajudar com um exercício de respiração para aliviar a ansiedade?",
        "A ansiedade pode ser desgastante. Que tal fazer uma pausa e tentarmos uma respiração juntos?",
    ],
    "triste": [
        "Sinto muito que você esteja se sentindo assim. Quer conversar mais sobre isso?",
        "Eu lamento ouvir isso. Posso sugerir algumas dicas para melhorar seu humor?",
        "Sei que a tristeza pode ser pesada, mas você não está sozinho(a). Posso te ajudar com algumas dicas ou só ouvir, se preferir.",
        "Às vezes é difícil lidar com a tristeza. Se você quiser, posso sugerir algumas coisas que podem ajudar.",
    ],
    "bem": [
        "Que bom saber que você está bem! Tem algo com o qual eu possa te ajudar hoje?",
        "Fico feliz por saber que você está bem! Algo específico que você gostaria de conversar?",
        "Que notícia boa saber que você está bem! Se quiser, estou aqui para qualquer coisa que precisar.",
        "Que ótimo que está tudo bem! Como posso te ajudar hoje? Quer compartilhar algo bom que tenha acontecido?",
    ],
    "autoestima": [
        "Eu sei que a autoestima pode ser desafiadora às vezes. Quer conversar sobre isso?",
        "A autoestima é algo importante. Posso te ajudar com algumas dicas?",
        "Sei que a autoestima pode ser uma questão difícil. Gostaria de conversar mais sobre isso?",
    ],
    "sono": [
        "Dormir bem é essencial para o bem-estar. Você tem tido dificuldades para dormir?",
        "O sono afeta muito como nos sentimos. Tem algo que tem te dificultado a dormir?",
        "O sono é muito importante para nossa saúde. Está tendo problemas para dormir?",
    ],
    "depressao": [
        "Eu entendo que a depressão pode ser muito difícil. Se você quiser, podemos conversar mais sobre isso.",
        "A depressão é algo muito pesado, e não é fácil lidar com ela sozinho(a). Estou aqui para você.",
        "Se você estiver passando por isso, posso te oferecer algumas sugestões ou só ouvir você.",
    ],
    "stress": [
        "O estresse pode ser bem cansativo. Gostaria de conversar mais sobre o que tem te causado isso?",
        "Eu sei que o estresse pode ser sobrecarregante. Está se sentindo assim ultimamente?",
        "O estresse é uma reação comum, mas também pode ser desgastante. Posso sugerir algumas maneiras de aliviá-lo?",
    ],
    "respiracao": [
        "Vamos respirar profundamente. Inspire pelo nariz e expire lentamente pela boca. Pode ajudar a aliviar a ansiedade.",
        "Tente fazer uma respiração lenta. Inspire por 4 segundos, segure por 4 e expire por 4. Isso pode ajudar muito.",
        "Respire profundamente. Inspire por 4 segundos, segure, depois expire lentamente. Isso pode aliviar a tensão.",
    ],
    "meditacao": [
        "A meditação pode ajudar a aliviar a ansiedade e o estresse. Gostaria de tentar agora?",
        "Que tal fazer uma meditação guiada por alguns minutos? Pode ser útil para acalmar a mente.",
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
        "Fico feliz que tenha compartilhado um pouco de como está se sentindo. Quando precisar, estarei aqui. Cuide-se!",
    ],
}


transitions = {
    "inicio": {
        "ansioso": "ansioso", "triste": "triste", "bem": "bem", "sair": "final", "autoestima": "autoestima", "sono": "sono",
    },
    "ansioso": {
        "sim": "respiracao", "não": "final", "meditar": "meditacao", "sair": "final",
    },
    "triste": {
        "sim": "dicas", "não": "final", "meditar": "meditacao", "sair": "final",
    },
    "bem": {
        "sim": "inicio", "não": "final", "sair": "final",
    },
    "respiracao": {
        "sim": "inicio", "não": "final", "sair": "final",
    },
    "dicas": {
        "sim": "inicio", "não": "final", "sair": "final",
    },
    "meditacao": {
        "sim": "inicio", "não": "final", "sair": "final",
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


def analyze_sentiment(user_input):
    if not user_input:
        return "neutro"
    
    sentiment_keywords = {
        "negativo": ["não", "triste", "difícil", "ansioso", "preocupado", "medo", "depressão", "estresse", "cansado"],
        "positivo": ["sim", "bem", "feliz", "ótimo", "alegria", "legal", "melhorando", "grato"],
        "neutro": ["ok", "sim", "não sei", "talvez", "meio a meio", "indiferente"],
    }

    for sentiment, keywords in sentiment_keywords.items():
        if any(word in user_input for word in keywords):
            return sentiment
    
    return "neutro"


def empathy_response(sentiment, response):
    empathy_map = {
        "negativo": "Eu sei que pode estar sendo difícil. Vou te sugerir algo para ajudar: ",
        "positivo": "Fico muito feliz que você esteja se sentindo melhor! ",
        "ansioso": "Entendo como a ansiedade pode ser complicada. Vamos respirar fundo juntos. ",
        "neutro": "Eu entendo. Estou aqui para ouvir você. ",
    }

    empathy_prefix = empathy_map.get(sentiment, "")
    
    if sentiment in ["negativo", "ansioso", "triste"]:
        suggestion = suggest_relaxation() if sentiment == "ansioso" else suggest_physical_activity()
        return empathy_prefix + response + " " + suggestion
    
    return empathy_prefix + response


def suggest_physical_activity():
    activities = [
        "Que tal levantar da cadeira e fazer alguns alongamentos? Isso pode ajudar a aliviar a tensão.",
        "Um pouco de movimento pode aliviar a ansiedade. Que tal dar uma caminhada curta?",
        "Exercícios físicos são ótimos para reduzir o estresse. Experimente um alongamento rápido.",
    ]
    return random.choice(activities)

def suggest_relaxation():
    relaxation_techniques = [
        "Que tal tentar uma respiração profunda agora? Inspire profundamente e solte lentamente.",
        "Uma técnica relaxante é a respiração abdominal. Tente inspirar profundamente e expirar devagar.",
        "Vamos tentar uma técnica simples de relaxamento? Respire profundamente por alguns segundos e sinta o alívio.",
    ]
    return random.choice(relaxation_techniques)


def check_if_final_state(next_state):
    emotional_states = ["ansioso", "triste", "autoestima", "depressao", "stress"]
    
    if next_state.lower() in emotional_states:
        return False
    
    return True

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    current_state = data.get("state", "inicio")
    user_input = data.get("message", "").strip().lower()

    if user_input == "sair":
        return jsonify({"response": "Adeus! Cuide-se e volte quando precisar.", "next_state": "final"})

    sentiment = analyze_sentiment(user_input)
    next_state = transitions.get(current_state, {}).get(user_input, "final")
    
   
    if check_if_final_state(next_state):
        response = random.choice(states["final"])
        next_state = "final"
    else:
        if next_state in states:
            response = random.choice(states[next_state])
        else:
            response = random.choice(states["final"])

        response = empathy_response(sentiment, response)

    return jsonify({"response": response, "next_state": next_state})


def start_server():
    app.run(host="0.0.0.0", port=5000)

if __name__ == "__main__":
    start_server()
