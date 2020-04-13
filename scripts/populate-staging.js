const child = require('child_process')
const util = require('util')
const path = require('path')
const fs = require('fs')

const groupBy = (n, items) =>
  !items || items.length < 1 ? [] : [items.slice(0, n), ...groupBy(n, items.slice(n))]

const groupsFile = path.join(__dirname, 'groups-table.json')
const awsDynamodb = `aws --profile covid --region eu-west-2 dynamodb`

child.execSync(`${awsDynamodb} scan --table-name dev-groups10 > ${groupsFile}`)
const groups = require(groupsFile)

const batches = groupBy(25, groups.Items).map((grps) => ({
  'staging-groups10': grps.map((Item) => ({ PutRequest: { Item } })),
}))

const writeBatch = (batch, i) => {
  const fileP = path.join(__dirname, `batch-${i}.json`)
  return util
    .promisify(fs.writeFile)(fileP, JSON.stringify(batch))
    .then(() =>
      util.promisify(child.exec)(`${awsDynamodb} batch-write-item --request-items file://${fileP}`)
    )
    .catch((err) => console.log(err))
    .then(() => util.promisify(fs.unlink)(fileP))
}

Promise.all(batches.map(writeBatch))
