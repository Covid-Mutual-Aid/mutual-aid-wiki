const child = require('child_process')
const util = require('util')
const path = require('path')
const fs = require('fs')

const awsDynamodb = `aws --profile covid --region eu-west-2 dynamodb`

const dl = () =>
  util.promisify(child.exec)(`${awsDynamodb} scan --table-name dev-groups10 > groups.json`)

const process = () =>
  Promise.resolve()
    .then(() =>
      util.promisify(child.exec)(`${awsDynamodb} scan --table-name dev-groups10 > groups.json`)
    )
    .then(() => require(path.join(__dirname, 'groups.json')))
    .then(({ Items }) =>
      Items.filter(
        ({ location_country, source }) =>
          source.S === 'mutualaidwiki' && location_country.S === 'GB'
      ).map(
        ({ name, links, location_name, location_coord, created_at }) =>
          `${name.S}* ${links.L[0].M.url.S}* ${location_name.S}* ${location_coord.M.lat.N}* ${location_coord.M.lng.N}*`
      )
    )
    .then((g) => {
      util.promisify(fs.writeFile)(
        'uk-groups.csv',
        ['name* link* location_name* lat* lng*', ...g].join('\n')
      )
    })

const getMemberCount = (groupId) =>
  axios.get('/v2.11/{GROUP_ID}?fields=members.limit(0).summary(true)')

const run = async () => {
  // console.log('Downloading...')
  // await dl()
  console.log('Processing...')
  await process()
  console.log('Done :-)')
}

run()
