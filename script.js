// Espera o conteúdo da página carregar completamente
document.addEventListener('DOMContentLoaded', () => {
    // --- NOVA SENHA DEFINIDA AQUI ---
    const CORRECT_EMAIL = "bianca@aniversario.com"; // Você pode manter ou alterar o email
    const CORRECT_PASSWORD = "fiel2304";

    // --- LÓGICA DA CONTAGEM REGRESSIVA ---
    // A data alvo é 11 de Setembro do ano atual.
    const currentYear = new Date().getFullYear();
    const anniversaryDate = new Date(`September 11, ${currentYear} 00:00:00`).getTime();

    const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = anniversaryDate - now;

        // Se a data já passou, mostra a mensagem de feliz aniversário
        if (distance < 0) {
            const countdownElement = document.getElementById('countdown');
            countdownElement.innerHTML = "Feliz Aniversário, Bê!";
            countdownElement.style.fontSize = "1.5rem"; // Ajusta o tamanho da fonte da mensagem
            countdownElement.style.fontWeight = "bold";
            // Para o intervalo para não continuar executando
            clearInterval(countdownInterval);
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').innerText = days.toString().padStart(2, '0');
        document.getElementById('hours').innerText = hours.toString().padStart(2, '0');
        document.getElementById('minutes').innerText = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').innerText = seconds.toString().padStart(2, '0');
    };

    // Inicia o intervalo e guarda a referência para poder parar depois
    const countdownInterval = setInterval(updateCountdown, 1000);
    updateCountdown(); // Chama a função uma vez para não esperar 1 segundo

    // --- Elementos do Login ---
    const loginOverlay = document.getElementById('login-overlay');
    const loginForm = document.getElementById('login-form');
    const loginBox = document.getElementById('login-box');

    // --- Elementos da tela de entrada e música ---
    const enterOverlay = document.getElementById('enter-overlay');
    const enterButton = document.getElementById('enter-button');
    const backgroundMusic = document.getElementById('background-music');
    const mainContainer = document.querySelector('.container');

    // Ajuste do volume da música (0.5 = 50%)
    backgroundMusic.volume = 0.5;

    // --- Lógica do Login ---
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Impede o envio do formulário
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (email === CORRECT_EMAIL && password === CORRECT_PASSWORD) {
            // Sucesso no login
            loginOverlay.style.opacity = '0';
            setTimeout(() => {
                loginOverlay.classList.add('hidden');
                enterOverlay.classList.remove('hidden');
            }, 500);
        } else {
            // Falha no login
            loginBox.classList.add('shake');
            setTimeout(() => {
                loginBox.classList.remove('shake');
            }, 500); // Remove a classe após a animação
        }
    });


    // --- Elementos da navegação das abas ---
    const buttons = {
        motivos: document.getElementById('btn-motivos'),
        fotos: document.getElementById('btn-fotos'),
        parabens: document.getElementById('btn-parabens'),
        pergunta: document.getElementById('btn-pergunta')
    };
    const contents = {
        motivos: document.getElementById('motivos'),
        fotos: document.getElementById('fotos'),
        parabens: document.getElementById('parabens'),
        pergunta: document.getElementById('pergunta')
    };

    // --- Lógica da Tela de Entrada ---
    enterButton.addEventListener('click', () => {
        backgroundMusic.play().catch(error => {
            console.log("A reprodução automática foi impedida:", error);
        });
        enterOverlay.style.opacity = '0';
        setTimeout(() => { 
            enterOverlay.classList.add('hidden');
            mainContainer.classList.remove('hidden');
        }, 500);
    });

    // --- Lógica da Navegação das Abas ---
    function showContent(id) {
        for (const key in contents) {
            contents[key].classList.remove('active');
            buttons[key].classList.remove('active');
        }
        contents[id].classList.add('active');
        buttons[id].classList.add('active');
    }

    for (const key in buttons) {
        buttons[key].addEventListener('click', () => {
            showContent(key);
        });
    }

    // --- LÓGICA DA PERGUNTA FINAL ---
    const noBtn = document.getElementById('no-btn');
    const yesBtn = document.getElementById('yes-btn');
    const questionWrapper = document.getElementById('question-wrapper');
    const successMsg = document.getElementById('success-msg');
    const toast = document.getElementById('toast-notification');
    let attemptCount = 0;

    const moveButton = (event) => {
        attemptCount++;
        
        if (attemptCount === 4) {
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }

        const container = document.querySelector('.question-container');
        const containerRect = container.getBoundingClientRect();
        const noBtnRect = noBtn.getBoundingClientRect();
        const yesBtnRect = yesBtn.getBoundingClientRect();

        const clickX = event.clientX - containerRect.left;
        const clickY = event.clientY - containerRect.top;

        const horizontalMidpoint = containerRect.width / 2;
        const verticalMidpoint = containerRect.height / 2;

        let targetXRange, targetYRange;

        if (clickX < horizontalMidpoint) {
            targetXRange = [horizontalMidpoint, containerRect.width - noBtnRect.width];
        } else {
            targetXRange = [0, horizontalMidpoint - noBtnRect.width];
        }

        if (clickY < verticalMidpoint) {
            targetYRange = [verticalMidpoint, containerRect.height - noBtnRect.height];
        } else {
            targetYRange = [0, verticalMidpoint - noBtnRect.height];
        }
        
        let newTop, newLeft, newAbsLeft, newAbsTop;

        do {
            newLeft = Math.random() * (targetXRange[1] - targetXRange[0]) + targetXRange[0];
            newTop = Math.random() * (targetYRange[1] - targetYRange[0]) + targetYRange[0];
            
            newLeft = Math.max(0, Math.min(newLeft, containerRect.width - noBtnRect.width));
            newTop = Math.max(0, Math.min(newTop, containerRect.height - noBtnRect.height));

            newAbsLeft = containerRect.left + newLeft;
            newAbsTop = containerRect.top + newTop;

        } while (
            newAbsLeft < yesBtnRect.right &&
            newAbsLeft + noBtnRect.width > yesBtnRect.left &&
            newAbsTop < yesBtnRect.bottom &&
            newAbsTop + noBtnRect.height > yesBtnRect.top
        );

        noBtn.style.top = `${newTop}px`;
        noBtn.style.left = `${newLeft}px`;
    };

    noBtn.addEventListener('click', (e) => moveButton(e));

    yesBtn.addEventListener('click', () => {
        questionWrapper.classList.add('hidden');
        successMsg.classList.remove('hidden');
    });

    showContent('motivos');
});
