class DashboardController {
  constructor() {
    this.state = {
      tick: 0,
      metrics: {
        progress: 0,
        diversity: 0,
        violations: 0,
        stalls: 0,
        entropy: 0,
        totalScore: 0,
      },
      params: {
        alpha: 1.0,
        beta: 0.5,
        gamma: 0.8,
        delta: 0.3,
      },
    };

    this.initializeControls();
    this.startSimulation();
  }

  initializeControls() {
    ['alpha', 'beta', 'gamma', 'delta'].forEach(param => {
      const slider = document.getElementById(param);
      const valueDisplay = document.getElementById(`${param}-value`);

      slider.addEventListener('input', (e) => {
        const value = parseFloat(e.target.value);
        this.state.params[param] = value;
        valueDisplay.textContent = value.toFixed(1);
        this.updateScore();
      });
    });

    document.getElementById('clear-log').addEventListener('click', () => {
      document.getElementById('intent-log').innerHTML = '';
    });
  }

  updateScore() {
    const { progress, diversity, violations, stalls } = this.state.metrics;
    const { alpha, beta, gamma, delta } = this.state.params;

    const score = alpha * progress + beta * diversity - gamma * violations - delta * stalls;
    this.state.metrics.totalScore = score;

    document.getElementById('total-score').textContent = score.toFixed(2);
  }

  updateMetrics() {
    this.state.tick++;
    this.state.metrics.progress += Math.random() * 2;
    this.state.metrics.diversity = Math.random() * 3;
    this.state.metrics.entropy = Math.random() * 2.5;

    if (Math.random() < 0.1) {
      this.state.metrics.violations++;
    }

    if (Math.random() < 0.05) {
      this.state.metrics.stalls++;
    }

    document.getElementById('tick').textContent = this.state.tick;
    document.getElementById('progress').textContent = this.state.metrics.progress.toFixed(1);
    document.getElementById('diversity').textContent = this.state.metrics.diversity.toFixed(2);
    document.getElementById('violations').textContent = this.state.metrics.violations;
    document.getElementById('stalls').textContent = this.state.metrics.stalls;
    document.getElementById('entropy').textContent = this.state.metrics.entropy.toFixed(2);

    this.updateScore();
  }

  logIntent(agent, action) {
    const logContainer = document.getElementById('intent-log');
    const entry = document.createElement('div');
    entry.className = 'log-entry';

    const time = new Date().toLocaleTimeString();
    const stages = ['Jury ✓', 'Judge ✓', 'Executioner ✓'];

    entry.innerHTML = `
      <span class="log-time">${time}</span>
      <span class="log-agent">${agent}</span>
      <span class="log-action">${action}</span>
      <span class="log-stage stage-jury">${stages[0]}</span>
      <span class="log-stage stage-judge">${stages[1]}</span>
      <span class="log-stage stage-exec">${stages[2]}</span>
    `;

    logContainer.insertBefore(entry, logContainer.firstChild);

    if (logContainer.children.length > 20) {
      logContainer.removeChild(logContainer.lastChild);
    }
  }

  drawDungeon() {
    const canvas = document.getElementById('dungeon-canvas');
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#1a1f2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#30363d';
    ctx.lineWidth = 2;

    const rooms = [
      { x: 50, y: 150, w: 80, h: 80, type: 'entry' },
      { x: 180, y: 150, w: 80, h: 80, type: 'corridor' },
      { x: 310, y: 150, w: 80, h: 80, type: 'treasure' },
      { x: 440, y: 150, w: 80, h: 80, type: 'boss' },
    ];

    rooms.forEach((room, i) => {
      ctx.fillStyle = room.type === 'boss' ? '#f85149' :
                      room.type === 'treasure' ? '#d29922' :
                      room.type === 'entry' ? '#56d364' : '#58a6ff';
      ctx.fillRect(room.x, room.y, room.w, room.h);

      ctx.strokeRect(room.x, room.y, room.w, room.h);

      ctx.fillStyle = '#e1e4e8';
      ctx.font = '12px sans-serif';
      ctx.fillText(room.type, room.x + 10, room.y + room.h / 2);

      if (i < rooms.length - 1) {
        ctx.strokeStyle = '#8b949e';
        ctx.beginPath();
        ctx.moveTo(room.x + room.w, room.y + room.h / 2);
        ctx.lineTo(rooms[i + 1].x, rooms[i + 1].y + room.h / 2);
        ctx.stroke();
      }
    });
  }

  startSimulation() {
    this.drawDungeon();

    setInterval(() => {
      this.updateMetrics();

      if (Math.random() < 0.3) {
        const agents = ['Warrior-001', 'Mage-002', 'Rogue-003', 'Cleric-004'];
        const actions = ['Move', 'Attack', 'Interact', 'Dash'];
        const agent = agents[Math.floor(Math.random() * agents.length)];
        const action = actions[Math.floor(Math.random() * actions.length)];
        this.logIntent(agent, action);
      }
    }, 2000);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new DashboardController();
});
