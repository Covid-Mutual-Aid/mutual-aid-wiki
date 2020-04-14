const path = require('path')
const fs = require('fs')
const endpoint = require('../stack.json').ServiceEndpoint

const redirects = fs.readFileSync(path.join(__dirname, '../client/_redirects'), 'utf8')

fs.writeFileSync(
  path.join(__dirname, '../client/_redirects'),
  redirects.replace(/http.*?:splat/gim, `${endpoint}/:splat`)
)
