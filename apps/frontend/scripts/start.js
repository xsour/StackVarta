const { spawn } = require('node:child_process');

const command = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const port = process.env.PORT || process.env.FRONTEND_PORT || '3000';

const child = spawn(command, ['next', 'start', '--hostname', '0.0.0.0', '--port', String(port)], {
  stdio: 'inherit',
  shell: true
});

child.on('exit', (code) => process.exit(code ?? 0));
