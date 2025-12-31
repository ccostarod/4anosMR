// ==================== JOGO DO CORAÇÃO IMPOSSÍVEL ====================

const heartGame = document.getElementById('heart-game');
const heart = document.getElementById('heart');
const gameMessage = document.getElementById('game-message');
const attemptsDisplay = document.getElementById('attempts');
const terminalScreen = document.getElementById('terminal-screen');

let attempts = 0;

// Mensagens engraçadas para cada tentativa
const messages = [
    "Opa! Quase! Tenta de novo 😏",
    "Achooou que ia ser fácil? 😂",
    "Última chance... ou não? 🤔"
];

// Posicionar coração inicialmente no centro
function positionHeart() {
    const gameRect = heartGame.getBoundingClientRect();
    heart.style.left = (gameRect.width / 2 - 50) + 'px';
    heart.style.top = (gameRect.height / 2) + 'px';
}

positionHeart();

// Mover coração para posição aleatória
function moveHeart() {
    const gameRect = heartGame.getBoundingClientRect();
    const maxX = gameRect.width - 120;
    const maxY = gameRect.height - 200;
    
    const randomX = Math.random() * maxX;
    const randomY = Math.random() * maxY + 100; // Evitar topo
    
    heart.style.left = randomX + 'px';
    heart.style.top = randomY + 'px';
}

// Evento de tentar clicar no coração
heart.addEventListener('mouseenter', () => {
    if (attempts < 3) {
        attempts++;
        attemptsDisplay.textContent = attempts;
        
        // Mover coração antes de clicar
        moveHeart();
        
        // Mostrar mensagem engraçada
        if (attempts <= messages.length) {
            gameMessage.textContent = messages[attempts - 1];
            gameMessage.style.color = '#d6336c';
        }
        
        // Se chegou em 3 tentativas, "falha" o sistema
        if (attempts === 3) {
            setTimeout(() => {
                gameMessage.textContent = "Sistema travou! Abrindo modo de recuperação...";
                gameMessage.style.color = '#ff0000';
            }, 500);
            
            setTimeout(() => {
                startTerminal();
            }, 2500);
        }
    }
});

// Para mobile - usar click em vez de hover
heart.addEventListener('click', (e) => {
    e.preventDefault();
    if (attempts < 3) {
        attempts++;
        attemptsDisplay.textContent = attempts;
        
        moveHeart();
        
        if (attempts <= messages.length) {
            gameMessage.textContent = messages[attempts - 1];
            gameMessage.style.color = '#d6336c';
        }
        
        if (attempts === 3) {
            setTimeout(() => {
                gameMessage.textContent = "Sistema travou! Abrindo modo de recuperação...";
                gameMessage.style.color = '#ff0000';
            }, 500);
            
            setTimeout(() => {
                startTerminal();
            }, 2500);
        }
    }
});

function startTerminal() {
    heartGame.classList.add('game-hidden');
    setTimeout(() => {
        heartGame.style.display = 'none';
        terminalScreen.style.display = 'flex';
        typeLine();
    }, 1000);
}

// ==================== TERMINAL ====================

// CONFIGURAÇÃO DO TERMINAL
const consoleOutput = document.getElementById('console-output');
// terminalScreen já foi declarado no início do arquivo
const loveContent = document.getElementById('love-content');

// As mensagens que vão aparecer no terminal
const logLines = [
    "> Initializing system...",
    "> Loading user: Rodrigo...",
    "> Loading user: Mariana...",
    "> Connecting hearts via secure protocol...",
    "> Connection established (Latency: 0ms).",
    "> Accessing memory database...",
    "> Searching for 'melhores momentos'...",
    "> 4 years found.",
    "> Analyzing data integrity...",
    "> STATUS: LOVE OVERFLOW DETECTED!",
    "> System cannot contain this much feeling.",
    "> Rebooting into visual mode..."
];

let lineIndex = 0;
let canContinue = false;

// Detectar se é mobile
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
}

function typeLine() {
    if (lineIndex < logLines.length) {
        const line = document.createElement('div');
        line.className = 'log-line';
        line.textContent = logLines[lineIndex];
        consoleOutput.appendChild(line);
        lineIndex++;
        // Velocidade aleatória para parecer processamento real
        setTimeout(typeLine, Math.random() * 300 + 100); 
    } else {
        // Fim do terminal, mostrar prompt para continuar
        setTimeout(showContinuePrompt, 800);
    }
}

function showContinuePrompt() {
    canContinue = true;
    
    if (isMobile()) {
        // Para mobile: criar botão
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'continue-button-container';
        buttonContainer.innerHTML = '<button id="continue-btn" class="continue-button">Continuar ❤️</button>';
        consoleOutput.appendChild(buttonContainer);
        
        document.getElementById('continue-btn').addEventListener('click', startTransition);
    } else {
        // Para desktop: mostrar mensagem de Enter
        const promptLine = document.createElement('div');
        promptLine.className = 'log-line continue-prompt';
        promptLine.innerHTML = '> <span class="blink-text">Press ENTER to continue...</span>';
        consoleOutput.appendChild(promptLine);
        
        // Listener para tecla Enter
        document.addEventListener('keydown', handleEnterKey);
    }
}

function handleEnterKey(e) {
    if (e.key === 'Enter' && canContinue) {
        document.removeEventListener('keydown', handleEnterKey);
        startTransition();
    }
}

function startTransition() {
    if (!canContinue) return;
    
    // Esconder terminal completamente
    terminalScreen.style.display = 'none';
    
    loveContent.classList.add('visible');
    
    // Inicializar slideshow, música e efeito typewriter
    setTimeout(() => {
        initSlideshow();
        initMusic();
        
        // Iniciar digitação após 1 segundo
        setTimeout(typeWriter, 1000);
    }, 500);
}

// ==================== SLIDESHOW DE FOTOS ====================

// Array com os caminhos das 32 fotos
const photos = [];
for (let i = 1; i <= 32; i++) {
    photos.push(`assets/foto${i}.jpg`);
}

let currentPhotoIndex = 0;
let slideshowInterval;

function initSlideshow() {
    const slideshow = document.getElementById('photo-slideshow');
    const totalNumber = document.getElementById('total-number');
    
    totalNumber.textContent = photos.length;
    
    // Criar elementos de imagem para o slideshow
    photos.forEach((src, index) => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = `Foto ${index + 1}`;
        if (index === 0) img.classList.add('active');
        slideshow.appendChild(img);
    });
    
    // Iniciar slideshow automático (muda a cada 4 segundos)
    startAutoSlideshow();
}

function startAutoSlideshow() {
    slideshowInterval = setInterval(() => {
        nextPhoto();
    }, 4000); // 4 segundos por foto
}

function nextPhoto() {
    const images = document.querySelectorAll('#photo-slideshow img');
    
    images[currentPhotoIndex].classList.remove('active');
    currentPhotoIndex = (currentPhotoIndex + 1) % photos.length;
    images[currentPhotoIndex].classList.add('active');
    
    // Atualizar contador
    document.getElementById('current-number').textContent = currentPhotoIndex + 1;
}

// ==================== EFEITO TYPEWRITER (TEXTO DIGITANDO) ====================

const letterText = `Quatro anos meu amor. Se pararmos para analisar, são quatro anos de momentos incríveis, de muito amor, amor esse tão grande que nem consigo explicar em palavras. Nesse tempo nós dois amadurecemos, mudamos bastante e crescemos juntos, e continuamos escolhendo o mesmo amor e o mesmo colo todos os dias. Começamos na época de escola, dois jovens que eram apenas amigos, que se apaixonaram e hoje somos esse amor tão grande e profundo. Eu te observo e te admiro e vejo muito mais do que apenas minha namorada incrível, eu te vejo como minha parceira de vida, meu alicerce.


Eu passo quase todos os dias escrevendo códigos, analisando dados que precisam ser exatos, mensuráveis e precisos. Mas você é a exceção desses dias. O que eu sinto por você não é exato, não é mensurável e não cabe em nenhuma métrica, não segue nenhuma lógica binária e nem nada do tipo. Na verdade, você é a cor dos meus dias nublados, você é a emoção no meio de tanta razão. Você é a fervura que aquece meu coração, é intensidade e calmaria, e é o que me faz sentir a vida como ela deve ser. Você é meu ponto de equilíbrio, e ao mesmo tempo, a pessoa que me impulsiona a ser melhor. 


Você é muito especial meu amor, você é verdadeiramente incrível, e a mulher que você vem se tornando nesses últimos anos me enche de orgulho e motivação. Eu agradeço por ter sido você, por ser minha alma gêmea, e por transformar a minha vida em algo muito melhor do que eu poderia ter planejado sozinho. Eu agradeço o destino por ter me dado você e a vida maravilhosa que vivo ao seu lado. No mais, deixo meu agradecimento ao maior de todos, meu Deus e nosso Senhor, que possibilita tudo que vivemos juntos. E que venham os próximos 4, 5, 10, 30, 50 anos de nossa vida.


Eu te amei ontem, te amo hoje e te amarei amanhã.


Com muito amor, Rodrigo.`;

let charIndex = 0;
let typingSpeed = 30; // milissegundos por caractere

function typeWriter() {
    if (charIndex < letterText.length) {
        const typedTextElement = document.getElementById('typed-text');
        const char = letterText.charAt(charIndex);
        
        if (char === '\n') {
            // Verificar se a próxima também é \n (parágrafo duplo)
            const nextChar = letterText.charAt(charIndex + 1);
            if (nextChar === '\n') {
                // Pular linhas vazias e adicionar quebra de parágrafo
                typedTextElement.innerHTML += '<br><br>';
                charIndex++; // Pular o próximo \n também
            }
            // Se for apenas um \n, ignorar (continuação do texto)
        } else {
            // Adicionar caractere ao final do HTML existente
            typedTextElement.innerHTML += char;
        }
        
        charIndex++;
        
        // Variar velocidade para parecer mais natural
        const variance = Math.random() * 20;
        setTimeout(typeWriter, typingSpeed + variance);
        
        // Auto-scroll suave
        typedTextElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
    } else {
        // Esconder cursor quando terminar
        const cursor = document.querySelector('.typing-cursor');
        if (cursor) cursor.style.display = 'none';
    }
}

// ==================== MÚSICA DE FUNDO ====================

function initMusic() {
    const audio = document.getElementById('background-music');
    
    // Ajustar volume (0.0 a 1.0, onde 0.3 = 30% do volume)
    audio.volume = 0.3;
    
    // Tentar tocar automaticamente
    audio.play().catch(() => {
        // Se o navegador bloquear, tentar quando o usuário interagir
        document.addEventListener('click', () => {
            audio.play();
        }, { once: true });
    });
}

// Iniciar (não chama mais automaticamente, espera o jogo do coração)
// window.onload = typeLine; // REMOVIDO

