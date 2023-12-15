# diagnosis/views.py
from django.shortcuts import render
from django.http import JsonResponse
from .forms import DiagnosticoForm
import json
import pickle
import os
import numpy as np
from sklearn.preprocessing import LabelEncoder
from sklearn.tree import DecisionTreeClassifier
from django.views.decorators.csrf import csrf_exempt

# Carregar o modelo treinado
modelo_treinado_path = os.path.join(os.path.dirname(__file__), 'data', 'model', '2dt_model.pkl')
with open(modelo_treinado_path, 'rb') as file:
    clf_modelo_treinado = pickle.load(file)

# Carregar o mapeamento
mapping_path = os.path.join(os.path.dirname(__file__), 'data', 'model', '2class_mapping.pkl')
with open(mapping_path, 'rb') as file:
    label_encoder_mapping = pickle.load(file)

# Verificar se a chave 'classes_' está presente no mapeamento
if 'classes_' in label_encoder_mapping:
    # Criar um novo objeto LabelEncoder e definir as classes usando o mapeamento
    label_encoder = LabelEncoder()
    label_encoder.classes_ = label_encoder_mapping['classes_']
else:
    # Se a chave 'classes_' não estiver presente, criar um novo objeto LabelEncoder sem classes definidas
    label_encoder = LabelEncoder()

def index(request):
    form = DiagnosticoForm()
    return render(request, 'diagnosis/pages/index.html', {'form': form})

@csrf_exempt
def selecionar_sintomas(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
            sintomas = data.get('sintomas', [])

            # Codificar os sintomas usando o LabelEncoder
            sintomas_codificados = label_encoder.transform(sintomas)

            # Inicializar um vetor de 192 elementos com zeros
            dados_paciente_np = np.zeros(192)

            # Definir as posições correspondentes aos sintomas como 1
            for sintoma_codificado in sintomas_codificados:
                dados_paciente_np[sintoma_codificado] = 1

            # Reformular o array para o formato esperado pelo modelo
            dados_paciente_np = dados_paciente_np.reshape(1, -1)

            # Obter as probabilidades das classes diretamente do modelo treinado
            probas = clf_modelo_treinado.predict_proba(dados_paciente_np)[0]

            # Pegar os n rótulos com as maiores probabilidades
            n = 3  # Este é um valor de exemplo. Ajuste conforme necessário.
            indices_top_n = probas.argsort()[-n:][::-1]
            rotulos_relevantes = clf_modelo_treinado.classes_[indices_top_n]

            # Retornar os resultados como uma resposta JSON
            return JsonResponse({'diagnosticos': list(rotulos_relevantes)})

        except json.JSONDecodeError as e:
            return JsonResponse({'error': 'Erro de decodificação JSON: {}'.format(str(e))}, status=400)

    # Se a solicitação não for POST, retornar uma resposta vazia
    return JsonResponse({})
