// Date Update
function setDate() {
  const options = { month: 'short', day: 'numeric', year: 'numeric' };
  const today = new Date().toLocaleDateString('en-US', options);
  const dateElement = document.getElementById('currentDate');
  if (dateElement) {
    dateElement.innerText = today;
  }
}

setDate();

// Sidebar navigation
const navigationButtons = document.querySelectorAll('.nav-btn');

navigationButtons.forEach((button) => {
  button.addEventListener('click', () => {
    navigationButtons.forEach((navButton) => {
      navButton.classList.remove('active');
    });
    button.classList.add('active');

    if (button.id === 'btnHome') {
      window.location.href = 'index.html';
    } else if (button.id === 'btnProgress') {
      window.location.href = 'index.html#waterTracker';
    } else if (button.id === 'btnSettings') {
      window.location.href = 'settings.html';
    }
  });
});

// Initialize Donut Chart
const chartCanvas = document.getElementById('nutritionChart');
if (chartCanvas && typeof Chart !== 'undefined') {
  const ctx = chartCanvas.getContext('2d');
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Calorie Tracker', 'Proteins', 'Carbs', 'Fats', 'Water'],
      datasets: [{
        data: [35, 20, 20, 15, 10],
        backgroundColor: ['#48bb78', '#4299e1', '#ed8936', '#ecc94b', '#9f7aea'],
        borderWidth: 0,
        cutout: '75%'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      }
    }
  });
}


// Progress Bar update karne ka function
function updateProgressBar(consumed, target) {
  let percentage = Math.round((consumed / target) * 100);
  
  // Maximum 100% limit
  if (percentage > 100) {
    percentage = 100;
  }

  // Update Progress Bar fill width
  const progressBar = document.getElementById('calorieFill');
  if (!progressBar) {
    return;
  }
  progressBar.style.width = percentage + '%';

  // Update Text Labels
  document.getElementById('calorieDetail').innerText = `${consumed} / ${target} kcal`;
  document.getElementById('caloriePercent').innerText = `${percentage}%`;
}

// Demo data Call: 1500 consumed out of 2000 kcal Goal (75%)
updateProgressBar(1500, 2000);

// Water tracker controls
const waterProgressFill = document.getElementById('waterProgressFill');
const addWaterButton = document.getElementById('addWaterButton');
const resetWaterButton = document.getElementById('resetWaterButton');

if (waterProgressFill && addWaterButton && resetWaterButton) {
  const waterPercentage = document.getElementById('waterPercentage');
  const waterStatus = document.getElementById('waterStatus');
  const waterCompleted = document.getElementById('waterCompleted');
  const waterTrack = waterProgressFill.parentElement;
  let completed = 0;

  function renderWaterProgress() {
    const percentage = completed * 10;
    const status = percentage === 0
      ? ['Getting Started', 'status-started']
      : percentage === 100
        ? ['Goal Completed', 'status-completed']
        : ['In Progress', 'status-progress'];

    waterProgressFill.style.width = `${percentage}%`;
    waterPercentage.textContent = `${percentage}%`;
    waterStatus.textContent = status[0];
    waterStatus.className = `status-tag ${status[1]}`;
    waterCompleted.textContent = `${completed}/10 Completed`;
    waterTrack.setAttribute('aria-valuenow', percentage);
    addWaterButton.disabled = completed === 10;
  }

  addWaterButton.addEventListener('click', () => {
    if (completed < 10) {
      completed += 1;
      renderWaterProgress();
    }
  });

  resetWaterButton.addEventListener('click', () => {
    completed = 0;
    renderWaterProgress();
  });

  renderWaterProgress();
}