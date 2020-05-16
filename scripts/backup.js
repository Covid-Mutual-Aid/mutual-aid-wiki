const child = require('child_process')
const util = require('util')
const path = require('path')
const fs = require('fs')
const axios = require('axios')

const groupBy = (n, items) =>
  !items || items.length < 1 ? [] : [items.slice(0, n), ...groupBy(n, items.slice(n))]

const groupsFile = path.join(__dirname, 'groups-table.json')
const awsDynamodb = `aws --profile covid --region eu-west-2 dynamodb`

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

const geolocateCountry = (coord) =>
  axios
    .get(
      `http://api.geonames.org/countryCodeJSON?lat=${coord.lat}&lng=${coord.lng}&username=tapjay`
    )
    .then((x) => (x.data.status ? Promise.reject(new Error(x.data.status.message)) : x.data))

// geolocateCountry({ lat: 49.03, lng: 10.2 }).then(console.log)
// geolocateCountry({ lat: -4.113144, lng: -134.523833 }).then(console.log) // Not a country

const geolocateCountries = (groups) => {
  const [BATCH_SIZE, INTERVAL] = [50, 1000]
  const delay = (t) => (v) => new Promise((resolve) => setTimeout(() => resolve(v), t))

  const recurse = (groups, geolocated) =>
    geolocated.then((gl) =>
      groups.length === 0
        ? Promise.resolve(gl.filter(({ country }) => country !== null))
        : Promise.all(
            groups.slice(0, BATCH_SIZE).map(
              (g) =>
                new Promise((resolve) => {
                  geolocateCountry({
                    lat: g.location_coord.M.lat.N,
                    lng: g.location_coord.M.lng.N,
                  }).then(({ countryCode }) => {
                    resolve({
                      ...g,
                      country: { S: countryCode },
                    })
                  })
                })
            )
          )
            .then(delay(INTERVAL))
            .then((batch) => recurse(groups.slice(BATCH_SIZE), Promise.resolve(batch.concat(gl))))
    )

  return recurse(groups, Promise.resolve([]))
}

const withSource = () =>
  util
    .promisify(child.exec)(`${awsDynamodb} scan --table-name dev-groups10 > ${groupsFile}`)
    .then(() => require(groupsFile))
    .then((groups) =>
      groups.Items.slice(0, 10).map((g) => ({
        ...g,
        source: {
          S: 'mutual-aid-wiki',
        },
      }))
    )
    .then((g) => util.promisify(fs.writeFile)('with-source.json', JSON.stringify(g)))

const withCountries = () =>
  util
    .promisify(child.exec)(`${awsDynamodb} scan --table-name dev-groups10 > ${groupsFile}`)
    .then(() => require(groupsFile))
    .then((groups) =>
      groups.Items.slice(0, 3).map((g) => ({
        ...g,
        source: {
          S: 'mutual-aid-wiki',
        },
      }))
    )
    .then(geolocateCountries)
    .then((g) => util.promisify(fs.writeFile)('with-countries.json', JSON.stringify(g)))

withCountries()

// .then((g) => (g.country ? Promise.resolve(g) : { ...g, country: { S: '' } }))
// .then((groups) =>
//   groupBy(25, groups.Items).map((grps) => ({
//     'staging-groups10': grps.map((Item) => ({ PutRequest: { Item } })),
//   }))
// )
// .then((batches) => Promise.all(batches.map(writeBatch)))
