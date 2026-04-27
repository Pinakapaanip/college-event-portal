const { spawn } = require('child_process');
const path = require('path');

const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const services = [
  { name: 'backend', cwd: path.join(__dirname, 'backend') },
  { name: 'frontend', cwd: path.join(__dirname, 'frontend') },
];

const children = [];
let shuttingDown = false;

function stopAll(signal = 'SIGINT') {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;

  for (const child of children) {
    if (!child.killed) {
      child.kill(signal);
    }
  }
}

for (const service of services) {
  const child = spawn(npmCommand, ['run', 'dev'], {
    cwd: service.cwd,
    stdio: 'inherit',
    shell: true,
  });

  child.on('exit', (code, signal) => {
    if (!shuttingDown) {
      shuttingDown = true;
      for (const otherChild of children) {
        if (otherChild !== child && !otherChild.killed) {
          otherChild.kill('SIGINT');
        }
      }

      process.exit(code ?? (signal ? 1 : 0));
    }
  });

  child.on('error', (error) => {
    console.error(`[${service.name}] failed to start:`, error.message);
    stopAll();
    process.exit(1);
  });

  children.push(child);
}

process.on('SIGINT', () => stopAll('SIGINT'));
process.on('SIGTERM', () => stopAll('SIGTERM'));