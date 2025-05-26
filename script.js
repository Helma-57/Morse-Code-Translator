// Morse Code Dictionary
const morseCodeMap = {
    // Letters
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 
    'F': '..-.', 'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 
    'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---', 
    'P': '.--.', 'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-', 
    'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-', 'Y': '-.--', 
    'Z': '--..',
    
    // Numbers
    '0': '-----', '1': '.----', '2': '..---', '3': '...--', 
    '4': '....-', '5': '.....', '6': '-....', '7': '--...', 
    '8': '---..', '9': '----.',
    
    // Punctuation and special characters
    '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.', 
    '!': '-.-.--', '/': '-..-.', '(': '-.--.', ')': '-.--.-', 
    '&': '.-...', ':': '---...', ';': '-.-.-.', '=': '-...-', 
    '+': '.-.-.', '-': '-....-', '_': '..--.-', '"': '.-..-.', 
    '$': '...-..-', '@': '.--.-.', ' ': '/'
};

// Reverse the map for Morse to text conversion
const textFromMorseMap = {};
for (const key in morseCodeMap) {
    textFromMorseMap[morseCodeMap[key]] = key;
}

// DOM Elements
const textInput = document.getElementById('textInput');
const morseOutput = document.getElementById('morseOutput');
const toMorseBtn = document.getElementById('toMorseBtn');
const toTextBtn = document.getElementById('toTextBtn');
const playBtn = document.getElementById('playBtn');
const copyBtn = document.getElementById('copyBtn');
const clearBtn = document.getElementById('clearBtn');
const exampleBtns = document.querySelectorAll('.example-btn');
const morseAudio = document.getElementById('morseAudio');
const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;

// Theme Management
function setTheme(theme) {
    localStorage.setItem('theme', theme);
    htmlElement.setAttribute('data-theme', theme);
}

function toggleTheme() {
    const currentTheme = localStorage.getItem('theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
}

// Initialize theme
const savedTheme = localStorage.getItem('theme') || 'light';
setTheme(savedTheme);

// Convert text to Morse code
function textToMorse(text) {
    return text.toUpperCase().split('').map(char => {
        return morseCodeMap[char] || char;
    }).join(' ');
}

// Convert Morse code to text
function morseToText(morse) {
    return morse.split(' ').map(code => {
        return textFromMorseMap[code] || code;
    }).join('');
}

// Play Morse code as sound
function playMorseCode(morse) {
    morseAudio.pause();
    morseAudio.currentTime = 0;
    
    const dotDuration = 100;
    const dashDuration = 3 * dotDuration;
    const spaceDuration = dotDuration;
    const slashDuration = 3 * dotDuration;
    
    let time = 0;
    
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContext();
    
    morse.split('').forEach(symbol => {
        switch(symbol) {
            case '.':
                scheduleBeep(time, dotDuration);
                time += dotDuration + spaceDuration;
                break;
            case '-':
                scheduleBeep(time, dashDuration);
                time += dashDuration + spaceDuration;
                break;
            case ' ':
                time += slashDuration;
                break;
            case '/':
                time += slashDuration * 2;
                break;
        }
    });
    
    function scheduleBeep(startTime, duration) {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.value = 800;
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(1, startTime + 0.001);
        gainNode.gain.linearRampToValueAtTime(0, startTime + duration - 0.001);
        
        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
    }
}

// Event Listeners
toMorseBtn.addEventListener('click', () => {
    const text = textInput.value.trim();
    if (text) {
        morseOutput.value = textToMorse(text);
    } else {
        alert('Please enter some text to convert to Morse code.');
    }
});

toTextBtn.addEventListener('click', () => {
    const morse = morseOutput.value.trim();
    if (morse) {
        textInput.value = morseToText(morse);
    } else {
        alert('Please enter some Morse code to convert to text.');
    }
});

playBtn.addEventListener('click', () => {
    const morse = morseOutput.value.trim();
    if (morse) {
        playMorseCode(morse);
    } else {
        alert('No Morse code to play. Please convert text to Morse first.');
    }
});

copyBtn.addEventListener('click', () => {
    if (morseOutput.value) {
        navigator.clipboard.writeText(morseOutput.value)
            .then(() => alert('Morse code copied to clipboard!'))
            .catch(err => alert('Failed to copy: ' + err));
    } else {
        alert('No Morse code to copy.');
    }
});

clearBtn.addEventListener('click', () => {
    textInput.value = '';
    morseOutput.value = '';
});

exampleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const textExample = btn.getAttribute('data-text');
        const morseExample = btn.getAttribute('data-morse');
        
        if (textExample) {
            textInput.value = textExample;
            morseOutput.value = textToMorse(textExample);
        } else if (morseExample) {
            morseOutput.value = morseExample;
            textInput.value = morseToText(morseExample);
        }
    });
});

themeToggle.addEventListener('click', toggleTheme);