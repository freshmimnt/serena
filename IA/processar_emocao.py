import sys

def processar_emocao(texto):
    # Aqui você vai implementar o A* ou qualquer outro algoritmo que quiser
    # Exemplo básico de análise de emoção
    if 'ansioso' in texto.lower():
        return 'Recomendo técnicas de respiração para aliviar a ansiedade.'
    elif 'triste' in texto.lower():
        return 'Recomendo uma conversa com um amigo ou um momento de reflexão.'
    else:
        return 'Não consegui identificar a emoção. Poderia fornecer mais detalhes?'

if __name__ == "__main__":
    entrada = sys.argv[1] 
    resposta = processar_emocao(entrada)
    print(resposta)
