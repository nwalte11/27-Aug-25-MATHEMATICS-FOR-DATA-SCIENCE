// Minimalistic practice logic for slope-intercept form
// Uses a random point and slope, checks user input, and updates UI/graph

document.addEventListener('DOMContentLoaded', () => {

  // Generate random slope and y-intercept
  const m = Math.floor(Math.random() * 7) - 3; // -3 to 3
  const b = Math.floor(Math.random() * 11) - 5; // -5 to 5
  // Exclude 0 from x and y
  function getNonZeroCoord() {
    let val = 0;
    while (val === 0) {
      val = Math.floor(Math.random() * 11) - 5;
    }
    return val;
  }
  const x = getNonZeroCoord();
  const y = m * x + b;
  // If y is 0, regenerate x until y != 0
  while (y === 0) {
    const newX = getNonZeroCoord();
    if (m * newX + b !== 0) {
      x = newX;
      break;
    }
  }

  document.getElementById('coord').textContent = `(${x}, ${y})`;

  // Input logic
  const input = document.getElementById('slope-input');
  const form = document.getElementById('slope-form');
  const feedback = document.getElementById('feedback');
  const mainPane = document.querySelector('.main-pane');
  const graph = document.getElementById('graph');
  const correctCell = document.getElementById('correct-tries');
  const totalCell = document.getElementById('total-tries');
  const incorrectCell = document.getElementById('incorrect-tries');
  let correctTries = 0;
  let totalTries = 0;
  let incorrectTries = 0;

  function checkAnswer(e) {
    e.preventDefault();
    const val = input.value.trim().replace(/\s+/g, ' ');
    let correct = false;
    if (m === 0) {
      correct = val === `y= ${b}`;
    } else if (b === 0) {
      correct = val === `y= ${m}x`;
    } else {
      correct = val === `y= ${m}x + ${b}` || val === `y= ${b} + ${m}x`;
    }
    totalTries++;
    if (correct) {
      correctTries++;
      mainPane.classList.remove('incorrect');
      mainPane.classList.add('correct');
      feedback.innerHTML = '✅😊😊';
    } else {
      incorrectTries++;
      mainPane.classList.remove('correct');
      mainPane.classList.add('incorrect');
      feedback.innerHTML = '❌😞😞';
      if (incorrectTries === 3) {
        showTutorial();
      }
    }
    updateTables();
    plotLine(m, b);
  }

  function updateTables() {
    correctCell.textContent = correctTries;
    totalCell.textContent = totalTries;
    incorrectCell.textContent = incorrectTries;
  }

  function showTutorial() {
    let tutorial = document.getElementById('tutorial-pane');
    if (!tutorial) {
      tutorial = document.createElement('div');
      tutorial.id = 'tutorial-pane';
      tutorial.innerHTML = `
        <div class="tutorial-content">
          <h2>How to Find the Slope of a Line</h2>
          <p>The slope-intercept form of a line is <b>y = mx + b</b>, where <b>m</b> is the slope and <b>b</b> is the y-intercept.</p>
          <ul>
            <li>Find the slope (m) by using two points: <b>m = (y2 - y1) / (x2 - x1)</b></li>
            <li>The y-intercept (b) is where the line crosses the y-axis.</li>
            <li>Plug the values into the equation: <b>y = mx + b</b></li>
          </ul>
          <p>Watch this video for more help:</p>
          <a href="https://www.youtube.com/watch?v=c-iK1SCCINc" target="_blank">Slope Tutorial Video</a>
        </div>
      `;
      tutorial.style.position = 'fixed';
      tutorial.style.top = '0';
      tutorial.style.left = '0';
      tutorial.style.width = '100vw';
      tutorial.style.height = '100vh';
      tutorial.style.background = 'rgba(247,243,237,0.98)';
      tutorial.style.zIndex = '1000';
      tutorial.style.display = 'flex';
      tutorial.style.justifyContent = 'center';
      tutorial.style.alignItems = 'center';
      document.body.appendChild(tutorial);
    }
  }

  form.addEventListener('submit', checkAnswer);
  updateTables();

  // Plotting with canvas
  function plotLine(m, b) {
    const ctx = graph.getContext('2d');
    ctx.clearRect(0, 0, graph.width, graph.height);
    // White background
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, graph.width, graph.height);

    // Draw blue grid lines
    ctx.strokeStyle = '#3a86ff';
    ctx.lineWidth = 1;
    for (let i = 0; i <= graph.width; i += 20) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, graph.height);
      ctx.stroke();
    }
    for (let j = 0; j <= graph.height; j += 20) {
      ctx.beginPath();
      ctx.moveTo(0, j);
      ctx.lineTo(graph.width, j);
      ctx.stroke();
    }

    // Draw axes (thicker blue)
    ctx.strokeStyle = '#003366';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, graph.height/2);
    ctx.lineTo(graph.width, graph.height/2);
    ctx.moveTo(graph.width/2, 0);
    ctx.lineTo(graph.width/2, graph.height);
    ctx.stroke();

    // Draw axis labels (black)
    ctx.fillStyle = '#111';
    ctx.font = '13px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    for (let i = -8; i <= 8; i += 2) {
      if (i === 0) continue;
      ctx.fillText(i, graph.width/2 + i*20, graph.height/2 + 4);
    }
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    for (let j = -4; j <= 4; j += 2) {
      if (j === 0) continue;
      ctx.fillText(j, graph.width/2 - 6, graph.height/2 - j*20);
    }

    // Draw line (red)
    ctx.strokeStyle = '#e63946';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let px = 0; px <= graph.width; px++) {
      const xVal = (px - graph.width/2) / 20;
      const yVal = m * xVal + b;
      const py = graph.height/2 - yVal * 20;
      if (px === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
  }

  // Initial plot
  plotLine(m, b);
});
