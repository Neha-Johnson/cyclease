// Import Firebase SDK modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-analytics.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBYy5Vb9oG-2wQwiHR-hViUrbRa0oTRMQ8",
  authDomain: "cyclease-a1471.firebaseapp.com",
  projectId: "cyclease-a1471",
  storageBucket: "cyclease-a1471.firebasestorage.app",
  messagingSenderId: "844242131474",
  appId: "1:844242131474:web:fdc9759ea2ae91ae6d56cb",
  measurementId: "G-T17X0M6JPG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

// Authentication Logic
document.getElementById('signupForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      alert('Sign-up successful!');
      document.getElementById('signupForm').reset();
    })
    .catch((error) => {
      alert(`Error: ${error.message}`);
    });
});

document.getElementById('loginForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      alert('Logged in successfully!');
      document.getElementById('loginForm').reset();
      document.getElementById('logoutBtn').style.display = 'block';
    })
    .catch((error) => {
      alert(`Error: ${error.message}`);
    });
});

document.getElementById('logoutBtn').addEventListener('click', () => {
  signOut(auth)
    .then(() => {
      alert('Logged out successfully!');
      document.getElementById('logoutBtn').style.display = 'none';
    })
    .catch((error) => {
      alert(`Error: ${error.message}`);
    });
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log('User logged in:', user.email);
    document.getElementById('logoutBtn').style.display = 'block';
  } else {
    console.log('No user logged in');
    document.getElementById('logoutBtn').style.display = 'none';
  }
});



// Example: Add interactivity to buttons
document.getElementById('logSymptoms').addEventListener('click', () => {
  alert('Log your symptoms here!');
});

document.addEventListener('DOMContentLoaded', () => {
  // Basic button interactions
  document.getElementById('joinCommunity')?.addEventListener('click', () => {
    alert('Join the community and share your experiences!');
  });

  // Games Section Logic
  const playGameBtn = document.getElementById('playGame');
  const gameSection = document.querySelector('.game');
  const gameCards = document.querySelectorAll('.game-card');
  const gamesSection = document.getElementById('games');

  // Add Back to Games button
  gamesSection.insertAdjacentHTML('beforeend', `
    <button id="backToGames" class="btn" style="display: none; margin-top: 2rem;">Back to Games Menu</button>
  `);
  
  const backToGamesBtn = document.getElementById('backToGames');

  // Initialize meditation timer
  const meditationTimer = new MeditationTimer();

  // Add event listeners for timer buttons
  document.querySelectorAll('.timer-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const minutes = parseInt(btn.dataset.minutes);
      meditationTimer.start(minutes);
    });
  });

  document.querySelector('.stop-timer')?.addEventListener('click', () => {
    meditationTimer.stop();
  });

  // Play Now button click handler
  playGameBtn?.addEventListener('click', () => {
    console.log('Play button clicked'); // Debug log
    
    // Hide the initial view
    gameSection.style.display = 'none';
    
    // Show all game cards
    gameCards.forEach(card => {
      card.classList.add('active');
    });

    // Show back button
    backToGamesBtn.style.display = 'block';

    // Initialize games
    const breathing = new BreathingExercise();
    breathing.start(5);
    const memoryGame = new MemoryGame();
  });

  // Back button click handler
  backToGamesBtn?.addEventListener('click', () => {
    // Hide all game cards
    gameCards.forEach(card => {
      card.classList.remove('active');
    });
    
    // Show the initial view
    gameSection.style.display = 'block';
    
    // Hide back button
    backToGamesBtn.style.display = 'none';
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

  // Smooth scrolling
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
});

function validateGameConfig(config) {
  if (!config || typeof config !== 'object') {
    throw new Error('Invalid game configuration');
  }
  // Add more validation as needed
}

// Breathing Exercise
class BreathingExercise {
  constructor() {
    this.breathingText = document.getElementById('breathingText');
    this.circle = document.querySelector('.circle');
    this.progressBar = document.querySelector('.progress');
    this.soundEnabled = false;
    this.duration = 0;
    this.currentTime = 0;
    this.interval = null;
    this.phaseInterval = null;
    
    this.phases = [
      { text: 'Breathe In...', duration: 4000, action: 'inhale' },
      { text: 'Hold...', duration: 4000, action: 'hold' },
      { text: 'Breathe Out...', duration: 4000, action: 'exhale' },
      { text: 'Hold...', duration: 2000, action: 'hold' }
    ];
    
    this.affirmations = [
      'You are calm and centered',
      'Let go of tension',
      'Feel your body relax',
      'You are doing great'
    ];
    
    this.currentPhase = 0;
    this.setupEventListeners();
  }

  setupEventListeners() {
    document.querySelectorAll('.session-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const minutes = parseInt(btn.dataset.duration);
        this.start(minutes);
      });
    });

    document.querySelector('.sound-toggle').addEventListener('click', (e) => {
      this.soundEnabled = !this.soundEnabled;
      e.target.textContent = this.soundEnabled ? '🔇 Mute' : '🔊 Sound';
    });
  }

  start(minutes) {
    this.duration = minutes * 60 * 1000;
    this.currentTime = 0;
    this.updateProgress();
    
    if (this.interval) this.stop();
    
    // Start the breathing cycle
    this.nextPhase();
    this.phaseInterval = setInterval(() => {
      this.nextPhase();
    }, 4000); // Change phase every 4 seconds

    // Start the progress timer
    this.interval = setInterval(() => {
      this.currentTime += 100;
      this.updateProgress();
      
      if (this.currentTime >= this.duration) {
        this.complete();
      }
    }, 100);

    this.showAffirmation();
  }

  nextPhase() {
    const phase = this.phases[this.currentPhase];
    this.breathingText.textContent = phase.text;
    
    this.circle.classList.remove('inhale', 'exhale');
    if (phase.action === 'inhale') {
      this.circle.classList.add('inhale');
      if (this.soundEnabled) this.playSound('inhale');
    } else if (phase.action === 'exhale') {
      this.circle.classList.add('exhale');
      if (this.soundEnabled) this.playSound('exhale');
    }
    
    this.currentPhase = (this.currentPhase + 1) % this.phases.length;
  }

  updateProgress() {
    const progress = (this.currentTime / this.duration) * 100;
    this.progressBar.style.width = `${progress}%`;
  }

  showAffirmation() {
    if (this.currentTime % 20000 === 0) { // Show every 20 seconds
      const affirmation = this.affirmations[Math.floor(Math.random() * this.affirmations.length)];
      const element = document.createElement('div');
      element.classList.add('affirmation');
      element.textContent = affirmation;
      this.circle.appendChild(element);
      
      setTimeout(() => element.classList.add('show'), 100);
      setTimeout(() => {
        element.classList.remove('show');
        setTimeout(() => element.remove(), 500);
      }, 3000);
    }
  }

  playSound(type) {
    // Add your sound implementation here
    const audio = new Audio(`assets/sounds/${type}.mp3`);
    audio.play().catch(() => console.log('Sound failed to play'));
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    if (this.phaseInterval) {
      clearInterval(this.phaseInterval);
      this.phaseInterval = null;
    }
    this.breathingText.textContent = 'Exercise paused';
    this.circle.classList.remove('inhale', 'exhale');
  }

  complete() {
    this.stop();
    this.breathingText.textContent = 'Great job! You completed the session.';
    setTimeout(() => {
      this.breathingText.textContent = 'Click a duration to start again';
    }, 3000);
  }
}

// Memory Game
class MemoryGame {
  constructor() {
    this.cards = [];
    this.flippedCards = [];
    this.matchedPairs = 0;
    this.isLocked = false;
    this.symbols = ['💖', '🌸', '🍫', '🧘', '☕', '🫖', '🌿', '🎭'];
    this.setupGame();
  }

  setupGame() {
    const gameContainer = document.querySelector('.memory-game');
    if (!gameContainer) return;

    // Clear previous game
    gameContainer.innerHTML = '';
    this.cards = [];
    this.flippedCards = [];
    this.matchedPairs = 0;
    this.isLocked = false;

    // Create pairs of cards and shuffle them
    const cardPairs = [...this.symbols, ...this.symbols];
    this.shuffleArray(cardPairs);

    // Create and render cards
    cardPairs.forEach((symbol, index) => {
      const card = this.createCard(symbol, index);
      this.cards.push(card);
      gameContainer.appendChild(card);
    });

    // Add game controls
    const controls = document.createElement('div');
    controls.className = 'memory-controls';
    controls.innerHTML = `
      <button class="btn restart-btn">Restart Game</button>
      <div class="score">Matches: <span>0</span>/${this.symbols.length}</div>
    `;
    gameContainer.parentElement.appendChild(controls);

    // Add event listener for restart button
    document.querySelector('.restart-btn').addEventListener('click', () => {
      this.setupGame();
    });
  }

  createCard(symbol, index) {
    const card = document.createElement('div');
    card.className = 'memory-card';
    card.dataset.index = index;
    card.dataset.symbol = symbol;
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front">?</div>
        <div class="card-back">${symbol}</div>
      </div>
    `;

    card.addEventListener('click', () => this.flipCard(card));
    return card;
  }

  flipCard(card) {
    if (
      this.isLocked || 
      this.flippedCards.length >= 2 || 
      this.flippedCards.includes(card) ||
      card.classList.contains('matched')
    ) return;

    card.classList.add('flipped');
    this.flippedCards.push(card);

    if (this.flippedCards.length === 2) {
      this.isLocked = true;
      this.checkMatch();
    }
  }

  checkMatch() {
    const [card1, card2] = this.flippedCards;
    const match = card1.dataset.symbol === card2.dataset.symbol;

    if (match) {
      this.handleMatch(card1, card2);
    } else {
      this.handleMismatch(card1, card2);
    }
  }

  handleMatch(card1, card2) {
    card1.classList.add('matched');
    card2.classList.add('matched');
    this.matchedPairs++;
    this.updateScore();
    
    this.flippedCards = [];
    this.isLocked = false;

    if (this.matchedPairs === this.symbols.length) {
      this.handleGameComplete();
    }
  }

  handleMismatch(card1, card2) {
    setTimeout(() => {
      card1.classList.remove('flipped');
      card2.classList.remove('flipped');
      this.flippedCards = [];
      this.isLocked = false;
    }, 1000);
  }

  handleGameComplete() {
    setTimeout(() => {
      const message = document.createElement('div');
      message.className = 'game-complete';
      message.innerHTML = `
        <h3>Congratulations! 🎉</h3>
        <p>You've matched all the pairs!</p>
        <button class="btn play-again">Play Again</button>
      `;
      
      document.querySelector('.memory-game').appendChild(message);
      message.querySelector('.play-again').addEventListener('click', () => {
        this.setupGame();
      });
    }, 500);
  }

  updateScore() {
    const scoreElement = document.querySelector('.score span');
    if (scoreElement) {
      scoreElement.textContent = this.matchedPairs;
    }
  }

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}

// Meditation Timer
class MeditationTimer {
  constructor() {
    this.isLoading = false;
    this.timeLeft = 0;
    this.isRunning = false;
    this.interval = null;
    this.display = document.querySelector('.timer-display');
  }

  async start(minutes) {
    const config = { minutes };
    validateGameConfig(config);
    
    try {
      this.isLoading = true;
      if (this.isRunning) return;
      this.timeLeft = minutes * 60;
      this.isRunning = true;
      this.interval = setInterval(() => this.tick(), 1000);
    } finally {
      this.isLoading = false;
    }
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

  async playChime() {
    try {
      const audio = new Audio('path/to/chime.mp3');
      await audio.play();
    } catch (error) {
      console.error('Failed to play audio:', error);
      // Implement fallback or user notification
    }
  }
}

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

class ErrorBoundary {
  static handleError(error) {
    console.error('An error occurred:', error);
    // Add proper error handling/reporting
  }
}

class Dashboard {
  constructor() {
    this.tips = [
      {
        title: "Stay Hydrated",
        image: "assets/images/hydration.jpg",
        details: [
          "Drink 8-10 glasses of water daily",
          "Avoid caffeine and alcohol",
          "Try herbal teas like chamomile",
          "Eat water-rich fruits and vegetables"
        ]
      },
      {
        title: "Exercise",
        image: "assets/images/exercise.jpg",
        details: [
          "Light yoga or stretching",
          "30 minutes of walking",
          "Swimming or low-impact activities",
          "Regular exercise reduces cramps"
        ]
      },
      {
        title: "Heat Therapy",
        image: "assets/images/heat.jpg",
        details: [
          "Use a heating pad",
          "Take warm baths",
          "Apply heat for 15-20 minutes",
          "Try heated patches"
        ]
      },
      {
        title: "Nutrition",
        image: "assets/images/nutrition.jpg",
        details: [
          "Increase iron-rich foods",
          "Add omega-3 fatty acids",
          "Reduce salt intake",
          "Eat small, frequent meals"
        ]
      }
    ];

    this.activeIndex = null;
    this.init();
  }

  init() {
    this.renderTipCircles();
    this.setupEventListeners();
  }

  renderTipCircles() {
    const container = document.querySelector('.tips-circles');
    if (!container) return;

    container.innerHTML = this.tips.map((tip, index) => `
      <div class="tip-circle" data-index="${index}">
        ${tip.title}
      </div>
    `).join('');
  }

  setupEventListeners() {
    document.querySelectorAll('.tip-circle').forEach(circle => {
      circle.addEventListener('click', (e) => {
        const index = parseInt(e.currentTarget.dataset.index);
        this.handleClick(index);
      });
    });
  }

  handleClick(index) {
    const circles = document.querySelectorAll('.tip-circle');
    const detailsContainer = document.querySelector('.tip-details');

    if (this.activeIndex === index) {
      // Deactivate
      this.activeIndex = null;
      circles[index].classList.remove('active');
      detailsContainer.classList.remove('show');
    } else {
      // Activate
      if (this.activeIndex !== null) {
        circles[this.activeIndex].classList.remove('active');
      }
      this.activeIndex = index;
      circles[index].classList.add('active');
      this.showTipDetails(index);
    }
  }

  showTipDetails(index) {
    const tip = this.tips[index];
    const detailsContainer = document.querySelector('.tip-details');
    
    detailsContainer.innerHTML = `
      <img src="${tip.image}" alt="${tip.title}">
      <h3>${tip.title}</h3>
      <ul>
        ${tip.details.map(detail => `<li>${detail}</li>`).join('')}
      </ul>
    `;
    
    detailsContainer.classList.add('show');
  }
}

// Initialize Dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const dashboard = new Dashboard();
});


// Add this to script.js

class FAQSection {
  constructor() {
    this.crampsData = [
      {
        question: "How can I relieve menstrual cramps quickly?",
        answer: "Applying a heating pad or hot water bottle to your lower abdomen helps relax muscles and ease pain."
      },
      {
        question: "Does exercise help with cramps?",
        answer: "Yes! Gentle activities like yoga, stretching, or light walking increase blood flow and reduce cramping."
      },
      {
        question: "Can drinking water reduce cramps?",
        answer: "Absolutely. Staying hydrated helps prevent bloating, which can make cramps feel worse."
      },
      {
        question: "Are there foods that can make cramps better or worse?",
        answer: "Avoid caffeine, salty, and fatty foods. Instead, eat anti-inflammatory foods like fruits, veggies, and whole grains."
      },
      {
        question: "What over-the-counter medicine works for cramps?",
        answer: "Ibuprofen or naproxen are great options to reduce inflammation and pain."
      },
      {
        question: "Do herbal teas help with cramps?",
        answer: "Yes, teas like chamomile, ginger, or peppermint have soothing properties that can ease discomfort."
      },
      {
        question: "Can vitamins or supplements help with cramps?",
        answer: "Magnesium and Vitamin B1 might reduce menstrual pain for some people."
      },
      {
        question: "How does massage help with cramps?",
        answer: "Gently massaging your lower abdomen with essential oils like lavender can help relax muscles and reduce pain."
      },
      {
        question: "Will taking a bath help with cramps?",
        answer: "A warm bath can soothe both your body and mind, providing relief from cramps."
      }
    ];

    this.pmsData = [
      {
        question: "How can I prepare for PMS symptoms?",
        answer: "Tracking your cycle helps you anticipate when PMS symptoms are likely to start."
      },
      {
        question: "Can diet changes help with PMS?",
        answer: "Eating smaller, more frequent meals with complex carbs can stabilize mood swings and reduce bloating."
      },
      {
        question: "Does exercise reduce PMS symptoms?",
        answer: "Yes! Regular physical activity boosts endorphins, helping to reduce anxiety, depression, and fatigue."
      },
      {
        question: "How important is sleep for PMS relief?",
        answer: "Very! Aim for 7-9 hours of quality sleep to manage mood swings and fatigue effectively."
      },
      {
        question: "Should I avoid caffeine and alcohol during PMS?",
        answer: "Limiting both can help ease PMS symptoms like mood swings and breast tenderness."
      },
      {
        question: "What are some good ways to manage PMS-related stress?",
        answer: "Deep breathing exercises, meditation, or journaling can help reduce anxiety and irritability."
      },
      {
        question: "Do supplements help with PMS?",
        answer: "Calcium, magnesium, and vitamin B6 may help ease PMS symptoms for some people."
      },
      {
        question: "Can being social improve PMS symptoms?",
        answer: "Yes! Talking to friends or doing activities you enjoy can lift your mood."
      },
      {
        question: "When should I see a doctor about PMS?",
        answer: "If your PMS symptoms are severe or interfere with daily life, you might have PMDD (Premenstrual Dysphoric Disorder). A doctor can help with treatment options."
      }
    ];

    this.init();
  }

  createFAQItem(data) {
    return `
      <div class="faq-item">
        <div class="faq-question">
          ${data.question}
          <span class="icon">▼</span>
        </div>
        <div class="faq-answer">
          ${data.answer}
        </div>
      </div>
    `;
  }

  init() {
    const crampsContainer = document.getElementById('crampsFAQ');
    const pmsContainer = document.getElementById('pmsFAQ');

    if (crampsContainer) {
      crampsContainer.innerHTML = this.crampsData.map(item => this.createFAQItem(item)).join('');
    }

    if (pmsContainer) {
      pmsContainer.innerHTML = this.pmsData.map(item => this.createFAQItem(item)).join('');
    }

    // Add click handlers
    document.querySelectorAll('.faq-question').forEach(question => {
      question.addEventListener('click', () => {
        const faqItem = question.parentElement;
        const wasActive = faqItem.classList.contains('active');
        
        // Close all other FAQ items
        document.querySelectorAll('.faq-item').forEach(item => {
          item.classList.remove('active');
        });
        
        // Toggle the clicked item
        if (!wasActive) {
          faqItem.classList.add('active');
        }
      });
    });
  }
}

// Initialize FAQ section when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const faqSection = new FAQSection();
});

// Modal Elements
const authBtn = document.getElementById('authBtn');
const authModal = document.getElementById('authModal');
const closeBtn = document.querySelector('.close-btn');

// Open Modal on Button Click
authBtn.addEventListener('click', () => {
  authModal.style.display = 'block';
});

// Close Modal on Close Button Click
closeBtn.addEventListener('click', () => {
  authModal.style.display = 'none';
});

// Close Modal if Clicked Outside the Modal Content
window.addEventListener('click', (event) => {
  if (event.target === authModal) {
    authModal.style.display = 'none';
  }
});
