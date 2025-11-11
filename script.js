document.addEventListener('DOMContentLoaded', () => {

    // --- DOM Elements ---
    const word1El = document.getElementById('word1');
    const word2El = document.getElementById('word2');
    const themeWordEl = document.getElementById('theme-word');
    const inputEl = document.getElementById('association-input');
    const newWordsBtn = document.getElementById('new-words-btn');
    const newThemeBtn = document.getElementById('new-theme-btn');
    const timerToggle = document.getElementById('timer-toggle');
    const timerDisplay = document.getElementById('timer-display');
    const historyLogEl = document.getElementById('history-log');
    const historyContainer = document.querySelector('.history-container');

    // --- State ---
    let wordBank = []; // Will be populated from 'words.txt'
    let currentWord1 = '';
    let currentWord2 = '';
    let currentTheme = '';
    let sessionLog = [];
    let timerInterval;
    let timeLeft = 60;

    // --- NEW: Load Word Bank from File ---
    async function loadWordBank() {
        try {
            const response = await fetch('words.txt');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const text = await response.text();
            
            // Process the text file
            wordBank = text.split('\n') // Split by new line
                           .map(word => word.trim()) // Remove whitespace
                           .filter(word => word.length > 0); // Remove empty lines
            
            if (wordBank.length === 0) {
                throw new Error('Word bank file is empty or formatted incorrectly.');
            }
            
            console.log(`Word bank loaded successfully with ${wordBank.length} words.`);

        } catch (error) {
            console.error('Failed to load word bank:', error);
            // Fallback in case fetch fails
            wordBank = ["Error", "Loading", "File", "Please", "Check", "words.txt"];
        }
    }

    // --- Get New Theme ---
    function generateTheme() {
        let newTheme = wordBank[Math.floor(Math.random() * wordBank.length)];
        while (newTheme === currentWord1 || newTheme === currentWord2) {
            newTheme = wordBank[Math.floor(Math.random() * wordBank.length)];
        }
        currentTheme = newTheme;
        themeWordEl.textContent = currentTheme;
    }

    // --- Get New Words ---
    function generateWords() {
        let newWord1 = wordBank[Math.floor(Math.random() * wordBank.length)];
        let newWord2 = wordBank[Math.floor(Math.random() * wordBank.length)];

        while (newWord1 === newWord2 || newWord1 === currentTheme || newWord2 === currentTheme) {
            newWord1 = wordBank[Math.floor(Math.random() * wordBank.length)];
            // Re-check for newWord1 === newWord2 in case it's a small list
            if (newWord1 === newWord2) {
                 newWord2 = wordBank[Math.floor(Math.random() * wordBank.length)];
            }
        }

        currentWord1 = newWord1;
        currentWord2 = newWord2;
        word1El.textContent = currentWord1;
        word2El.textContent = currentWord2;
        inputEl.value = '';
        
        resetAndStartTimer();
    }

    // --- Log Association ---
    function logAssociation() {
        const connection = inputEl.value.trim();
        if (connection) {
            const entry = {
                theme: currentTheme,
                pair: `${currentWord1} & ${currentWord2}`,
                connection: connection
            };
            sessionLog.push(entry);

            const li = document.createElement('li');
            li.innerHTML = `<strong>Theme: ${entry.theme}</strong><br>
                            <strong>Pair: ${entry.pair}</strong><br>
                            ${entry.connection}`;
            historyLogEl.prepend(li); 

            if (!historyContainer.classList.contains('visible')) {
                historyContainer.classList.add('visible');
            }
            
            generateWords();
        }
    }

    // --- Timer Functions ---
    function startTimer() {
        if (!timerToggle.checked) return;
        timerDisplay.classList.add('active');
        timeLeft = 60;
        timerDisplay.textContent = timeLeft;
        timerDisplay.style.color = '#555';

        timerInterval = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = timeLeft;
            if (timeLeft <= 10) {
                timerDisplay.style.color = '#d90429';
            }
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                generateWords();
            }
        }, 1000);
    }

    function resetAndStartTimer() {
        clearInterval(timerInterval);
        if (timerToggle.checked) {
            startTimer();
        } else {
            timerDisplay.classList.remove('active');
VSC       }
    }

    // --- Event Listeners ---
    newWordsBtn.addEventListener('click', generateWords);
    newThemeBtn.addEventListener('click', generateTheme);

    inputEl.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            logAssociation();
        }
    });

    timerToggle.addEventListener('change', () => {
        if (timerToggle.checked) {
            resetAndStartTimer();
        } else {
            clearInterval(timerInterval);
            timerDisplay.classList.remove('active');
        }
    });

    // --- Initial Load ---
    async function init() {
        await loadWordBank(); // Wait for words to load first
        
        // Only start the app if the word bank loaded
        if (wordBank.length > 3) {
            generateTheme();
            generateWords();
        } else {
            // Display error to the user
            themeWordEl.textContent = "Error";
            word1El.textContent = "Word";
            word2El.textContent = "Bank";
            console.error("App cannot start: Word bank is too small or failed to load.");
        }
    }
    
    init(); // Run the new initialization
});
