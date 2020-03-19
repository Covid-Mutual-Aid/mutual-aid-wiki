const { spawnSync } = require('child_process')
console.log('RUNNING')
spawnSync('ls', {
  cwd: process.cwd(),
  stdio: 'inherit',
})
