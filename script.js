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
  });
  
  document.getElementById('joinCommunity').addEventListener('click', () => {
    alert('Join the community and share your experiences!');
  });
  