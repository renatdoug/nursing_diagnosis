document.addEventListener('DOMContentLoaded', function () {
    // Carregar a lista de sintomas do arquivo JSON
    fetch('/static/diagnosis/js/symptoms.json')
        .then(response => response.json())
        .then(symptomsList => {
            // Exibir campo de entrada para sinais e sintomas ao carregar a página
            initializeSymptomsInput(symptomsList);
        });
});

// Lista de características (sintomas)
var selectedCharacteristics = [];

function initializeSymptomsInput(symptomsList) {
    var symptomsInput = document.getElementById('symptoms-input');
    var datalist = document.getElementById('symptoms-list');
  
    // Adicionar cada sintoma como uma opção no datalist
    symptomsList.forEach(function (symptom) {
        var option = document.createElement('option');
        option.value = symptom;
        datalist.appendChild(option);
    });
}

function addSymptom() {
    var selectedSymptomsInput = document.getElementById('symptoms-input');
    var selectedSymptomsList = document.getElementById('selected-symptoms-list');
  
    // Validar se pelo menos um sintoma foi inserido
    var symptom = selectedSymptomsInput.value.trim();
    if (!symptom) {
        alert('Por favor, selecione pelo menos um sinal ou sintoma.');
        return;
    }
  
    // Adicionar o sintoma à lista
    selectedCharacteristics.push(symptom);

    // Adicionar o sintoma à lista na página
    var listItem = document.createElement('li');
    listItem.textContent = symptom;
    selectedSymptomsList.appendChild(listItem);
  
    // Limpar o campo de entrada
    selectedSymptomsInput.value = '';
}

function submitSymptoms() {
    // Aqui você pode obter todos os sintomas selecionados da lista
    var symptoms = selectedCharacteristics;

    // Certifique-se de que há pelo menos um sintoma selecionado
    if (symptoms.length === 0) {
        alert('Por favor, selecione pelo menos um sinal ou sintoma.');
        return;
    }

    // Enviar os sintomas para a view Django para fazer a previsão
    fetch('/fazer_previsao/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({ sintomas: symptoms })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro na requisição: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        // Aqui, você pode lidar com os resultados da previsão recebidos do Django
        displayPredictionResults(data.diagnosticos);
    })
    .catch(error => {
        console.error('Erro ao fazer a previsão:', error);

        // Imprimir o corpo da resposta para depuração
        if (error.response && error.response.text) {
            console.error('Corpo da resposta:', error.response.text);
        }
    });
}

// Função para exibir os resultados da previsão na mesma página
function displayPredictionResults(diagnosticos) {
    console.log('Resultados da Previsão:', diagnosticos);
    var resultsContainer = document.getElementById('prediction-results');
    resultsContainer.innerHTML = '<p>Resultados da Previsão:</p>';
    
    if (diagnosticos.length > 0) {
        var list = document.createElement('ul');
        diagnosticos.forEach(function (diagnostico) {
            var listItem = document.createElement('li');
            listItem.textContent = diagnostico;
            list.appendChild(listItem);
        });
        resultsContainer.appendChild(list);
    } else {
        resultsContainer.innerHTML += '<p>Nenhum diagnóstico disponível.</p>';
    }
}

// Função para obter o cookie CSRF
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
