/**
 * This migration will:
 * - Rename the country to location_country
 * - Set location_country: country code
 * - Add a source: mutualaidwiki
 * - Set external: false
 *
 * Maybe we should:
 * - rename link_facebook to link
 * - Accept multiple kinds of links like in the email input (can be done in the future, but we should then turn links into an array of links)
 */

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

const omit = (keys, x) =>
  Object.keys(x).reduce((all, key) => (keys.includes(key) ? all : { ...all, [key]: x[key] }), {})

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
                      location_country: { S: countryCode },
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

//also delete country field, because we are now calling it location_country

const withCountriesAndSource = () =>
  util
    .promisify(child.exec)(`${awsDynamodb} scan --table-name dev-groups10 > ${groupsFile}`)
    .then(() => require(groupsFile))
    .then((groups) => groups.Items.slice(0, 3))
    .then((groups) =>
      groups.map((g) => ({
        ...omit(['country'], g),
        source: {
          S: 'mutualaidwiki',
        },
      }))
    )
    .then(geolocateCountries)
    .then((g) => util.promisify(fs.writeFile)('with-countries-and-source.json', JSON.stringify(g)))

withCountriesAndSource()

// .then((g) => (g.country ? Promise.resolve(g) : { ...g, country: { S: '' } }))
// .then((groups) =>
//   groupBy(25, groups.Items).map((grps) => ({
//     'staging-groups10': grps.map((Item) => ({ PutRequest: { Item } })),
//   }))
// )
// .then((batches) => Promise.all(batches.map(writeBatch)))
