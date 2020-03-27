import { execSync } from 'child_process'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

import { parse } from 'url'
import axios from 'axios'

const pkg = JSON.parse(readFileSync('package.json') as any)
const repoUrl = pkg.repository

const parsedUrl = parse(repoUrl)
const repository = (parsedUrl.host || '') + (parsedUrl.path || '')

process.env.GET_GROUPS = 'https://sn29v7uuxi.execute-api.eu-west-2.amazonaws.com/dev/group/get'
process.env.GITHUB_TOKEN = '64a919a8e309fd82f18110b5de8630a1709705d9'

const ghToken = process.env.GITHUB_TOKEN
const groupsEndpoint = process.env.GET_GROUPS

const groupsFile = join(__dirname, '../data/groups.json')
const getdata = () =>
  axios
    .get(groupsEndpoint)
    .then(({ data }) => writeFileSync(groupsFile, JSON.stringify(data), 'utf8'))

getdata().then(() => {
  execSync('echo downloading groups')

  execSync('cd ./data')
  execSync('git init')
  execSync('git add .')
  execSync('git config user.name "Dan Beaven"')
  execSync('git config user.email "dm.beaven@gmail.com"')
  execSync('git commit -m "docs(docs): update gh-pages"')
  execSync(`git push --force --quiet "https://${ghToken}@${repository}" master:groups`)
})
