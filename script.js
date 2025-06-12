// Elementos do DOM
const quantidadeInput = document.getElementById('quantidade');
const minimoInput = document.getElementById('minimo');
const maximoInput = document.getElementById('maximo');
const naoRepetirCheckbox = document.getElementById('naoRepetir');
const btnSortear = document.getElementById('btnSortear');
const btnReset = document.getElementById('btnReset');
const resultsSection = document.getElementById('resultsSection');
const numbersContainer = document.getElementById('numbersContainer');

// Estado da aplicação
let numerosSorteados = [];

// Event Listeners
btnSortear.addEventListener('click', sortearNumeros);
btnReset.addEventListener('click', resetarSorteio);

// Validação em tempo real dos inputs
quantidadeInput.addEventListener('input', validarInputs);
minimoInput.addEventListener('input', validarInputs);
maximoInput.addEventListener('input', validarInputs);

// Função principal de sorteio
async function sortearNumeros() {
    if (!validarFormulario()) {
        return;
    }

    const quantidade = parseInt(quantidadeInput.value);
    const minimo = parseInt(minimoInput.value);
    const maximo = parseInt(maximoInput.value);
    const naoRepetir = naoRepetirCheckbox.checked;

    // Verificar se é possível sortear a quantidade solicitada sem repetição
    if (naoRepetir) {
        const intervalo = maximo - minimo + 1;
        if (quantidade > intervalo) {
            alert(`Não é possível sortear ${quantidade} números únicos no intervalo de ${minimo} a ${maximo}. O máximo possível é ${intervalo}.`);
            return;
        }
    }

    // Mostrar loading
    mostrarLoading(true);
    
    // Aguardar um pouco para simular processamento
    await delay(800);
    
    // Gerar números
    if (naoRepetir) {
        numerosSorteados = gerarNumerosUnicos(quantidade, minimo, maximo);
    } else {
        numerosSorteados = gerarNumerosComRepeticao(quantidade, minimo, maximo);
    }
    
    // Esconder loading e mostrar resultados
    mostrarLoading(false);
    mostrarResultados();
}

// Função para gerar números únicos
function gerarNumerosUnicos(quantidade, minimo, maximo) {
    const numeros = [];
    const numerosDisponiveis = [];
    
    // Criar array com todos os números possíveis
    for (let i = minimo; i <= maximo; i++) {
        numerosDisponiveis.push(i);
    }
    
    // Sortear números únicos
    for (let i = 0; i < quantidade; i++) {
        const indiceAleatorio = Math.floor(Math.random() * numerosDisponiveis.length);
        const numeroSorteado = numerosDisponiveis.splice(indiceAleatorio, 1)[0];
        numeros.push(numeroSorteado);
    }
    
    return numeros;
}

// Função para gerar números com possível repetição
function gerarNumerosComRepeticao(quantidade, minimo, maximo) {
    const numeros = [];
    
    for (let i = 0; i < quantidade; i++) {
        const numeroSorteado = Math.floor(Math.random() * (maximo - minimo + 1)) + minimo;
        numeros.push(numeroSorteado);
    }
    
    return numeros;
}

// Função para mostrar os resultados com animação
function mostrarResultados() {
    resultsSection.style.display = 'block';
    numbersContainer.innerHTML = '';
    
    // Animar cada número aparecendo
    numerosSorteados.forEach((numero, index) => {
        setTimeout(() => {
            criarCartaoNumero(numero);
        }, index * 200); // Delay de 200ms entre cada número
    });
}

// Função para criar cartão de número
function criarCartaoNumero(numero) {
    const cartao = document.createElement('div');
    cartao.className = 'number-card';
    cartao.textContent = numero;
    
    // Adicionar delay na animação baseado na posição
    const delay = numbersContainer.children.length * 0.1;
    cartao.style.animationDelay = `${delay}s`;
    
    numbersContainer.appendChild(cartao);
    
    // Trigger da animação
    setTimeout(() => {
        cartao.style.transform = 'scale(1)';
    }, 50);
}

// Função para resetar o sorteio
function resetarSorteio() {
    resultsSection.style.display = 'none';
    numbersContainer.innerHTML = '';
    numerosSorteados = [];
    
    // Focar no primeiro input
    quantidadeInput.focus();
}

// Função para mostrar/esconder loading
function mostrarLoading(mostrar) {
    btnSortear.disabled = mostrar;
    
    if (mostrar) {
        btnSortear.innerHTML = `
            <span>SORTEANDO...</span>
            <div style="width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top: 2px solid white; border-radius: 50%; animation: spin 1s linear infinite;"></div>
        `;
    } else {
        btnSortear.innerHTML = `
            <span class="btn-text">SORTEAR</span>
            <svg class="btn-arrow" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;
    }
}

// Função para validar o formulário
function validarFormulario() {
    const quantidade = parseInt(quantidadeInput.value);
    const minimo = parseInt(minimoInput.value);
    const maximo = parseInt(maximoInput.value);
    
    // Verificar se todos os campos estão preenchidos
    if (!quantidade || !minimo || maximo === '' || isNaN(maximo)) {
        alert('Por favor, preencha todos os campos.');
        return false;
    }
    
    // Verificar se os valores são válidos
    if (quantidade <= 0) {
        alert('A quantidade deve ser maior que zero.');
        quantidadeInput.focus();
        return false;
    }
    
    if (quantidade > 20) {
        alert('A quantidade máxima é 20 números.');
        quantidadeInput.focus();
        return false;
    }
    
    if (minimo >= maximo) {
        alert('O número mínimo deve ser menor que o número máximo.');
        minimoInput.focus();
        return false;
    }
    
    return true;
}

// Função para validar inputs em tempo real
function validarInputs() {
    const quantidade = parseInt(quantidadeInput.value);
    const minimo = parseInt(minimoInput.value);
    const maximo = parseInt(maximoInput.value);
    
    // Habilitar/desabilitar botão baseado na validação
    const isValid = quantidade > 0 && 
                   quantidade <= 20 && 
                   !isNaN(minimo) && 
                   !isNaN(maximo) && 
                   minimo < maximo;
    
    btnSortear.disabled = !isValid;
}

// Função utilitária para delay
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Adicionar efeitos de teclado
document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' && !btnSortear.disabled) {
        sortearNumeros();
    }
    
    if (event.key === 'Escape' && resultsSection.style.display === 'block') {
        resetarSorteio();
    }
});

// Adicionar animação de spin para loading
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Focar no primeiro input
    quantidadeInput.focus();
    
    // Validar inputs iniciais
    validarInputs();
    
    // Adicionar animação de entrada suave
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

