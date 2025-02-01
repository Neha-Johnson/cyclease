// Example: Add interactivity to buttons
document.getElementById('logSymptoms').addEventListener('click', () => {
    alert('Log your symptoms here!');
  });
  
  document.getElementById('playGame').addEventListener('click', () => {
    // Hide the initial Mini-Games content
    document.querySelector('.game').style.display = 'none';
  
    // Show the Breathing Exercise game
    document.getElementById('breathingGame').style.display = 'block';
  
    startBreathingExercise();
  });
  
  // Stop the game and return to the initial content when the Stop button is clicked
  document.getElementById('stopGame').addEventListener('click', () => {
    // Hide the Breathing Exercise game
    document.getElementById('breathingGame').style.display = 'none';
  
    // Show the initial Mini-Games content again
    document.querySelector('.game').style.display = 'block';
  
    // Clear the breathing cycle
    clearInterval(breathingInterval);
  });
  
  let breathingInterval;
  
  // Function to handle breathing exercise steps
  function startBreathingExercise() {
    const breathingText = document.getElementById('breathingText');
    let phases = ['Breathe In', 'Hold', 'Breathe Out', 'Hold']; // The phases of breathing
    let phaseIndex = 0;
  
    // Change the text every 4 seconds (4000ms)
    breathingInterval = setInterval(() => {
      breathingText.textContent = phases[phaseIndex];
      phaseIndex = (phaseIndex + 1) % phases.length; // Cycle through the phases
    }, 4000);
  }
  
  document.getElementById('joinCommunity').addEventListener('click', () => {
    alert('Join the community and share your experiences!');
  });
  
// Breathing Exercise
class BreathingExercise {
  constructor() {
    this.breathingText = document.getElementById('breathingText');
    this.circle = document.querySelector('.circle');
    this.phases = [
      { text: 'Breathe In...', duration: 4000 },
      { text: 'Hold...', duration: 4000 },
      { text: 'Breathe Out...', duration: 4000 },
      { text: 'Hold...', duration: 4000 }
    ];
    this.currentPhase = 0;
  }

  start() {
    this.updateText();
    setInterval(() => this.nextPhase(), this.phases[this.currentPhase].duration);
  }

  updateText() {
    this.breathingText.textContent = this.phases[this.currentPhase].text;
  }

  nextPhase() {
    this.currentPhase = (this.currentPhase + 1) % this.phases.length;
    this.updateText();
  }
}

// Memory Game
class MemoryGame {
  constructor() {
    this.cards = [];
    this.flippedCards = [];
    this.matchedPairs = 0;
    this.setupGame();
  }

  setupGame() {
    const emojis = ['🌟', '🎨', '🎭', '🎮', '🎲', '🎯', '🎪', '🎨'];
    const gameGrid = [...emojis, ...emojis].sort(() => Math.random() - 0.5);
    
    const gameContainer = document.querySelector('.memory-game');
    gameGrid.forEach((emoji, index) => {
      const card = document.createElement('div');
      card.classList.add('memory-card');
      card.dataset.value = emoji;
      card.addEventListener('click', () => this.flipCard(card));
      gameContainer.appendChild(card);
    });
  }

  flipCard(card) {
    if (this.flippedCards.length === 2) return;
    if (!card.classList.contains('flipped')) {
      card.classList.add('flipped');
      card.textContent = card.dataset.value;
      this.flippedCards.push(card);
      
      if (this.flippedCards.length === 2) {
        this.checkMatch();
      }
    }
  }

  checkMatch() {
    const [card1, card2] = this.flippedCards;
    if (card1.dataset.value === card2.dataset.value) {
      this.matchedPairs++;
      this.flippedCards = [];
      if (this.matchedPairs === 8) {
        setTimeout(() => alert('Congratulations! You won!'), 500);
      }
    } else {
      setTimeout(() => {
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
        card1.textContent = '';
        card2.textContent = '';
        this.flippedCards = [];
      }, 1000);
    }
  }
}

// Meditation Timer
class MeditationTimer {
  constructor() {
    this.timeLeft = 0;
    this.isRunning = false;
    this.interval = null;
    this.display = document.querySelector('.timer-display');
  }

  start(minutes) {
    if (this.isRunning) return;
    this.timeLeft = minutes * 60;
    this.isRunning = true;
    this.interval = setInterval(() => this.tick(), 1000);
  }

  tick() {
    if (this.timeLeft > 0) {
      this.timeLeft--;
      this.updateDisplay();
    } else {
      this.stop();
      this.playChime();
    }
  }

  stop() {
    clearInterval(this.interval);
    this.isRunning = false;
  }

  updateDisplay() {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    this.display.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  playChime() {
    const audio = new Audio('path/to/chime.mp3');
    audio.play();
  }
}

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', () => {
  const breathing = new BreathingExercise();
  breathing.start();

  const memoryGame = new MemoryGame();
  
  const meditationTimer = new MeditationTimer();
  // Add event listeners for timer controls

  const video = document.getElementById('heroVideo');
  
  // Handle video loading errors
  video.addEventListener('error', () => {
    console.error('Error loading video');
    document.querySelector('.hero').style.backgroundImage = 
      'linear-gradient(rgba(255, 205, 178, 0.4), rgba(255, 205, 178, 0.4))';
  });

  // Ensure video plays on mobile devices
  video.play().catch(function(error) {
    console.log("Video play failed:", error);
  });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Header scroll effect
const header = document.querySelector('header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 100) {
    header.style.background = 'rgba(255, 255, 255, 0.98)';
    header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
  } else {
    header.style.background = 'rgba(255, 255, 255, 0.95)';
    header.style.boxShadow = 'none';
  }
});

// Mobile menu toggle
const createMobileMenu = () => {
  const nav = document.querySelector('nav ul');
  const menuButton = document.createElement('button');
  menuButton.classList.add('mobile-menu-btn');
  menuButton.innerHTML = '☰';
  document.querySelector('nav').prepend(menuButton);

  menuButton.addEventListener('click', () => {
    nav.classList.toggle('show');
  });
};

// Initialize mobile menu on small screens
if (window.innerWidth <= 768) {
  createMobileMenu();
}
  