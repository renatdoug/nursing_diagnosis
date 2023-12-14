document.addEventListener('DOMContentLoaded', function () {
    // Carregar a lista de sintomas do arquivo JSON
    fetch('/static/diagnosis/js/symptoms.json')
        .then(response => response.json())
        .then(symptomsList => {
            // Exibir campo de entrada para sinais e sintomas ao carregar a página
            initializeSymptomsInput(symptomsList);
        });
  });
  
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
    var listItem = document.createElement('li');
    listItem.textContent = symptom;
    selectedSymptomsList.appendChild(listItem);
  
    // Limpar o campo de entrada
    selectedSymptomsInput.value = '';
  }
  
  function getSelectedSymptoms() {
    // Obter todos os sintomas selecionados da lista
    var selectedSymptomsList = document.getElementById('selected-symptoms-list');
    return Array.from(selectedSymptomsList.children).map(function (listItem) {
        return listItem.textContent;
    });
  }
  
  function submitSymptoms() {
    // Aqui você pode obter todos os sintomas selecionados da lista
    var symptoms = getSelectedSymptoms();
  
    // Agora você pode usar a lista de sintomas para realizar a busca ou ação desejada
    // Exemplo: displaySearchResults(symptoms);
    alert('Busca realizada com sintomas: ' + symptoms.join(', '));
  }
  
  // ... Seu código existente ...
  
  function makePrediction(symptoms) {
    // Enviar os sintomas para a view Django para fazer a previsão
    fetch('/fazer_previsao/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-CSRFToken': getCookie('csrftoken')  // Certifique-se de incluir a função para obter o token CSRF
      },
      body: symptoms.map(s => 'sintomas[]=' + encodeURIComponent(s)).join('&')
    })
    .then(response => response.json())
    .then(data => {
      // Aqui, você pode lidar com os resultados da previsão recebidos do Django
      displayPredictionResults(data.diagnosticos);
    })
    .catch(error => {
      console.error('Erro ao fazer a previsão:', error);
    });
  }
  
  // Função para exibir os resultados da previsão na mesma página
  function displayPredictionResults(diagnosticos) {
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
  