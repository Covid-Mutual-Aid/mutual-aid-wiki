const { execSync } = require('child_process')
const path = require('path')

execSync(
  `serverless config credentials --provider aws --key ${process.env.AWS_ACCESS_KEY_ID} --secret ${process.env.AWS_SECRET_ACCESS_KEY}`,
  {
    cwd: path.join(process.cwd(), 'lambdas'),
    stdio: 'inherit',
  }
)

execSync(`sudo sls deploy`, {
  cwd: path.join(process.cwd(), 'lambdas'),
  stdio: 'inherit',
})
