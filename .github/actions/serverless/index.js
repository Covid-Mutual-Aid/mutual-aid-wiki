const { execSync } = require('child_process')
const path = require('path')

console.log('RUNNING')
execSync(
  `sls --key ${process.env.AWS_ACCESS_KEY_ID} --secret ${process.env.AWS_SECRET_ACCESS_KEY} deploy`,
  {
    cwd: path.join(process.cwd(), 'lambdas'),
    stdio: 'inherit',
  }
)
