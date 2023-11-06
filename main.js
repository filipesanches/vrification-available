const createStyle = (atribute) => {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = atribute;
  return document.head.appendChild(link);
};

const dragElement = (element) => {
  let pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;
  // Função chamada quando o mouse é pressionado sobre o elemento arrastável
  const dragMouseDown = (e) => {
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  };
  // Verifica se existe um elemento com o id do elemento arrastável seguido de 'moove'
  // Se existir, permite arrastar o elemento por esse elemento secundário, caso contrário, permite arrastar o próprio elemento
  if (document.getElementById(element.id + 'moove')) {
    document.getElementById(element.id + 'moove').onmousedown = dragMouseDown;
  } else {
    element.onmousedown = dragMouseDown;
  }
  // Função chamada enquanto o mouse é movido após o pressionamento inicial
  const elementDrag = (e) => {
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // Obter o tamanho da janela
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    // Obter a posição máxima permitida do elemento
    const maxPosX = windowWidth - element.offsetWidth;
    const maxPosY = windowHeight - element.offsetHeight;
    // Defina a nova posição do elemento dentro dos limites da janela
    const newPosX = element.offsetLeft - pos1;
    const newPosY = element.offsetTop - pos2;
    element.style.left = `${Math.min(Math.max(newPosX, 0), maxPosX)}px`;
    element.style.top = `${Math.min(Math.max(newPosY, 0), maxPosY)}px`;
  };
  // Função chamada quando o mouse é liberado, parando o arraste
  const closeDragElement = () => {
    document.onmouseup = null;
    document.onmousemove = null;
  };
};

//Função para alterar o tamanho do elemento
const resizeWindow = (element) => {
  // Cria um elemento 'div' para ser o redimensionador
  const resizer = document.createElement('div');
  resizer.className = 'resizer'; // Define uma classe para o redimensionador (pode ser estilizado usando CSS)
  resizer.style.width = '10px'; // Define a largura do redimensionador
  resizer.style.height = '10px'; // Define a altura do redimensionador
  resizer.style.background = 'none'; // Define o plano de fundo do redimensionador (pode ser estilizado com cores)
  resizer.style.position = 'absolute'; // Define a posição como absoluta
  resizer.style.right = 0; // Alinha o redimensionador à direita
  resizer.style.bottom = 0; // Alinha o redimensionador à parte inferior
  resizer.style.cursor = 'se-resize'; // Define o cursor do mouse ao passar sobre o redimensionador
  element.appendChild(resizer); // Adiciona o redimensionador como filho do elemento alvo
  // Função chamada quando o mouse é pressionado sobre o redimensionador
  const initResize = (e) => {
    window.addEventListener('mousemove', resize); // Escuta o evento de movimento do mouse para redimensionar
    window.addEventListener('mouseup', stopResize); // Escuta o evento de liberação do mouse para parar o redimensionamento
  };
  resizer.addEventListener('mousedown', initResize); // Escuta o evento de pressionamento do mouse no redimensionador
  // Função chamada durante o movimento do mouse após o pressionamento inicial
  const resize = (e) => {
    const maxWidth = window.innerWidth - element.offsetLeft; // Largura máxima permitida do elemento
    const maxHeight = window.innerHeight - element.offsetTop; // Altura máxima permitida do elemento
    const newWidth = Math.min(e.clientX - element.offsetLeft, maxWidth); // Nova largura calculada
    const newHeight = Math.min(e.clientY - element.offsetTop, maxHeight); // Nova altura calculada
    element.style.width = newWidth + 'px'; // Define a largura do elemento
    element.style.height = newHeight + 'px'; // Define a altura do elemento
  };
  // Função chamada quando o mouse é liberado, parando o redimensionamento
  const stopResize = (e) => {
    window.removeEventListener('mousemove', resize); // Remove o ouvinte do evento de movimento do mouse
    window.removeEventListener('mouseup', stopResize); // Remove o ouvinte do evento de liberação do mouse
  };
};
createStyle('https://filipesanches.github.io/vrification-available/style.css');
createStyle('https://fonts.googleapis.com/icon?family=Material+Icons');
dragElement(notes);
notes.innerHTML = `
<barra id="notesmoove">
  <span class="material-icons">edit_note</span>
  <span>Consultar</span>
  <span>
    <span class="material-icons minimize">minimize</span>
  </span>
</barra>

<div id="abas">
  <span id="agendamento" class="highlight" data-abas="content-1">Scheduling</span>
</div>

<section class="all-content">
  <div id="content-1" class="hide show">
  <button id='paste-data' class='buttons-blue'>colar dados</button>
  <table id='tabela'>
    <thead>
      <tr>
      <th>Ldap:</th>
      <th>Status:</th>
      <th>Tempo:</th>
      <th>available:</th>
      </tr>
    </thead>
    <tbody></tbody>
  </table>
  </div>
</section>
`;
let clipboardData = '';
// Obtém todos os elementos que possuem a classe 'minimize' ou 'notes-minimize' e adiciona o ouvinte de evento a cada um deles
const minimizeWindowElements = document.querySelectorAll('[class*="minimize"]');
minimizeWindowElements.forEach((e) => {
  e.addEventListener('click', (e) => {
    if (e.target.matches('.notes-minimize')) {
      e.target.classList.remove('notes-minimize');
      e.target.classList.remove('material-icons');
    }
    if (e.target.matches('.minimize')) {
      notes.classList.add('notes-minimize');
      notes.classList.add('material-icons');
    }
  });
});

// Aplica função resizeWindow
resizeWindow(notes);
function criarTabela() {
  const dados = clipboardData.split('\n');
  var tabela = document.getElementById('tabela');
  var tbody = tabela.getElementsByTagName('tbody')[0];
  tbody.innerHTML = '';

  dados.forEach(function (linha) {
    var elementos = linha.split(', ');
    var tr = document.createElement('tr');

    elementos.forEach(function (elemento) {
      var td = document.createElement('td');
      td.textContent = elemento;
      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  });
}

const pasteData = document.querySelector('#paste-data');
pasteData.addEventListener('click', function () {
  // Verifica se a API Clipboard é suportada no navegador
  if (navigator.clipboard) {
    navigator.clipboard
      .readText()
      .then(function (clipboardText) {
        // O conteúdo da área de transferência está em clipboardText
        console.log('Dados da área de transferência:', clipboardText);

        // Agora você pode fazer o que quiser com os dados, como atribuí-los a uma variável
        clipboardData = clipboardText;

        // Exemplo de uso da variável clipboardData
        console.log('Dados na variável:', clipboardData);
        criarTabela();
      })
      .catch(function (error) {
        console.error('Erro ao acessar a área de transferência: ' + error);
      });
  } else {
    console.error('A API Clipboard não é suportada neste navegador.');
  }
});
