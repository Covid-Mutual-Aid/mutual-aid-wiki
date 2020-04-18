const child = require('child_process')
const path = require('path')
const fs = require('fs')
const endpoint = require('../stack.json').ServiceEndpoint

const redirects = fs.readFileSync(path.join(__dirname, '../client/_redirects'), 'utf8')
const modified = redirects.replace(/http.*?:splat/gim, `${endpoint}/:splat`)
fs.writeFileSync(path.join(__dirname, '../client/_redirects'), modified)

child.execSync(`##[set-output name=modified;]"${modified === redirects ? 'FALSE' : 'TRUE'}"`)
