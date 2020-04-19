const child = require('child_process')
const path = require('path')
const fs = require('fs')
const endpoint = require('../stack.json').ServiceEndpoint

const redirects = fs.readFileSync(path.join(__dirname, '../client/_redirects'), 'utf8')
const modified = redirects.replace(/http.*?:splat/gim, `${endpoint}/:splat`)

const ghToken = process.env.GITHUB_TOKEN
const branch = process.env.BRANCH

if (redirects !== modified) {
  fs.writeFileSync(path.join(__dirname, '../client/_redirects'), modified)

  child.spawnSync('git', ['add', './client/_redirects'], { stdio: 'inherit' })
  child.spawnSync('git', ['config', 'user.name', 'Action bot'], { stdio: 'inherit' })
  child.spawnSync('git', ['config', 'user.email', 'bot@action.com'], { stdio: 'inherit' })
  child.spawnSync('git', ['commit', '-m', '"Update redirects"'], { stdio: 'inherit' })
  child.spawnSync(
    'git',
    ['push', '--quiet', `https://${ghToken}@github.com/Covid-Mutual-Aid/groups-map.git`, branch],
    { stdio: 'inherit' }
  )
}
