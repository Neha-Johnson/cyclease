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