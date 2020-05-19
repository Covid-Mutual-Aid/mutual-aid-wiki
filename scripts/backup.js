/**
 *
 * Run this to back
 *
 */

const child = require('child_process')
const util = require('util')
const path = require('path')
const fs = require('fs')

const awsDynamodb = `aws --profile covid --region eu-west-2 dynamodb`

const groupBy = (n, items) =>
  !items || items.length < 1 ? [] : [items.slice(0, n), ...groupBy(n, items.slice(n))]

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

const backup = () =>
  util.promisify(child.exec)(
    `${awsDynamodb} scan --table-name dev-groups10 > backups/${new Date().toISOString()}.json`
  )

// Not tested!!
const restore = (backupFilename) =>
  Promise.resolve()
    .then(() => require(path.join(__dirname, backupFilename)))
    .then((groups) =>
      groupBy(25, groups.Items).map((grps) => ({
        'dev-groups10': grps.map((Item) => ({ PutRequest: { Item } })),
      }))
    )
    .then((batches) => {
      console.log(batches, 'batches')
      return Promise.all(batches.map(writeBatch))
    })

backup()
//restore() //CAREFUL!!! Try on staging first
