require('dotenv').config()

let fs = require('fs')
let Xray = require('x-ray')
let x = Xray()

const filename = 'groups-seed.json'

console.log('Scraping...')
x(
  'https://docs.google.com/spreadsheets/u/0/d/e/2PACX-1vTvSFFG0ByJlzWLBVZ_-sYdhGLvMCCrbb_Fe9sA9LZ_Y_BFoq1BVEFGLf4t--pJ8gg73o0ULvqYlqdk/pubhtml/sheet?headers=false&gid=1451634215',
  'tr',
  [['td']]
)((err, groups) => {
  const nonEmptyValues = obj => Object.values(obj).reduce((a, c) => a + c).length !== 0
  const proccessed = groups.filter(nonEmptyValues).map((g, i) => ({
    id: i,
    name: g[1],
    link_facebook: g[2],
    location_name: g[0],
  }))

  fs.writeFileSync(filename, JSON.stringify(proccessed))
  console.log('Done.')
})
