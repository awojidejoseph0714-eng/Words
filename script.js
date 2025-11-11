document.addEventListener('DOMContentLoaded', () => {

    // --- Core Feature 1: Word Bank ---
    // A pre-curated word bank. This can be expanded significantly.
    const wordBank = [
        "Shadow", "River", "Clock", "Whisper", "Bridge", "Forest", "Market",
        "Silence", "Future", "Spark", "Code", "Mirror", "Journey", "Velvet",
        "Queen", "Anchor", "Byte", "Mountain", "Ocean", "Echo", "Glass",
        "Thread", "Rust", "Music", "Key", "Pocket", "System", "Hope", "North",
        "Wheel", "Signal", "Mask", "Atlas", "Root", "Canvas", "Grain", "Steam"
    ];

    // --- DOM Elements ---
    const word1El = document.getElementById('word1');
    const word2El = document.getElementById('word2');
    const inputEl = document.getElementById('association-input');
    const newBtn = document.getElementById('new-words-btn');
    const timerToggle = document.getElementById('timer-toggle');
    const timerDisplay = document.getElementById('timer-display');
    const historyLogEl = document.getElementById('history-log');
    const historyContainer = document.querySelector('.history-container');

    // --- State ---
    let currentWord1 = '';
    let currentWord2 = '';
    let sessionLog = [];
    let timerInterval;
    let timeLeft = 60;

    // --- Core Function: Get New Words ---
    function generateWords() {
        // 1. Get two different random words
        let newWord1 = wordBank[Math.floor(Math.random() * wordBank.length)];
        let newWord2 = wordBank[Math.floor(Math.random() * wordBank.length)];

        while (newWord1 === newWord2) {
            newWord2 = wordBank[Math.floor(Math.random() * wordBank.length)];
        }

        // 2. Update state and display
        currentWord1 = newWord1;
        currentWord2 = newWord2;
        word1El.textContent = currentWord1;
        word2El.textContent = currentWord2;

        // 3. Clear input
        inputEl.value = '';
        
        // 4. Handle timer
        resetAndStartTimer();
    }

    // --- Core Feature 3 & 4: Input & New Words Button ---
    function logAssociation() {
        const connection = inputEl.value.trim();
        if (connection) {
            // Log the association
            const entry = {
                pair: `${currentWord1} & ${currentWord2}`,
                connection: connection
            };
            sessionLog.push(entry);

            // Update the visual log
            const li = document.createElement('li');
            li.innerHTML = `<strong>${entry.pair}:</strong> ${entry.connection}`;
            historyLogEl.prepend(li); // Add to top

            // Make log visible if it's the first entry
            if (!historyContainer.classList.contains('visible')) {
                historyContainer.classList.add('visible');
            }

            // Get new words automatically after logging
            generateWords();
        }
    }

    // --- Core Feature 5: Optional Timer ---
    function startTimer() {
        if (!timerToggle.checked) return;

        timerDisplay.classList.add('active');
        timeLeft = 60;
        timerDisplay.textContent = timeLeft;
        timerDisplay.style.color = '#555'; // Reset color

        timerInterval = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = timeLeft;

            if (timeLeft <= 10) {
                timerDisplay.style.color = '#d90429'; // Warning color
            }

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                // Time's up! Force new words
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
        }
    }

    // --- Event Listeners ---
    
    // "New Words" button
    newBtn.addEventListener('click', generateWords);

    // "Enter" key in the input field
    inputEl.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            logAssociation();
        }
    });

    // Timer toggle
    timerToggle.addEventListener('change', () => {
        if (timerToggle.checked) {
            resetAndStartTimer();
        } else {
            clearInterval(timerInterval);
            timerDisplay.classList.remove('active');
        }
    });

    // --- Initial Load ---
    generateWords(); // Load the first pair on page load
});
