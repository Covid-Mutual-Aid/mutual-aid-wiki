/**
 * This migration will:
 * - Rename the country to location_country
 * - Set location_country: country code
 * - Add a source: mutualaidwiki
 * - Set external: false to all currently stored groups
 *
 * - Create links array [{link, name, created, updated}, ...]
 * - Store more useful geolocation info in location_fields
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

const AWS = {
  arr: (arr) => ({ L: arr }),
  str: (str) => ({ S: str }),
  bool: (bool) => ({ BOOL: bool }),
  obj: (obj) => ({ M: obj }),
}

const groupsFile = path.join(__dirname, 'with-countries-and-source.json')
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

const omit = (keys, x) =>
  Object.keys(x).reduce((all, key) => (keys.includes(key) ? all : { ...all, [key]: x[key] }), {})

const googleGeoLocate = (location) =>
  axios
    .get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(
        location
      )}&region=uk&key=AIzaSyDD8gtVtIrx6A0FpaTb7WXy0r1tZR8iECg`
    )
    .then((x) => {
      // console.log(x.data.results)
      return x.data.error_message ? Promise.reject(new Error(x.data.error_message)) : x.data.results
    })

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
                  googleGeoLocate(g.location_name.S).then(([place]) => {
                    resolve({
                      ...g,
                      location_country: AWS.str(
                        place && place.address_components.find((a) => a.types.includes('country'))
                          ? place.address_components.find((a) => a.types.includes('country'))
                              .short_name
                          : ''
                      ),
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

const getUrlType = (link) =>
  link.includes('facebook') ? 'facebook' : link.includes('whatsapp') ? 'whatsapp' : 'website'

const capitalise = (str) => str.charAt(0).toUpperCase() + str.slice(1)

const backup = () =>
  util.promisify(child.exec)(`${awsDynamodb} scan --table-name dev-groups10 > backup.json`)

const withCountriesAndSource = () =>
  util
    .promisify(child.exec)(`${awsDynamodb} scan --table-name dev-groups10 > ${groupsFile}`)
    .then(() => require(groupsFile))
    .then((groups) => {
      // console.log(groups.Items.length)
      console.log(count)
      return groups.Items.sort(
        (a, b) =>
          new Date(b.updated_at || '01 Jan 2020').valueOf() -
          new Date(a.updated_at || '01 Jan 2020').valueOf()
      )
      // .map((groups) => groups.Items.slice(0, 30))
      // .slice(0, 10)
    })
    .then((groups) => {
      return groups.map((g) => ({
        ...omit(['country'], g),
        source: AWS.str('mutualaidwiki'),
        external: AWS.bool(false),
        links: AWS.arr([
          AWS.obj({
            url: g.link_facebook,
          }),
        ]),
      }))
    })
    .then(geolocateCountries)
    .then((g) =>
      util.promisify(fs.writeFile)('dev-with-countries-and-source.json', JSON.stringify(g))
    )

const migrate = () =>
  Promise.resolve()
    .then(() => require(path.join(__dirname, 'dev-with-countries-and-source.json')))
    .then((groups) =>
      groupBy(25, groups).map((grps) => ({
        'dev-groups10': grps.map((Item) => ({ PutRequest: { Item } })),
      }))
    )
    .then((batches) => {
      console.log(batches, 'batches')
      return Promise.all(batches.map(writeBatch))
    })

// backup()
// withCountriesAndSource()
migrate()

// .then((g) => (g.country ? Promise.resolve(g) : { ...g, country: { S: '' } }))
// .then((groups) =>
//   groupBy(25, groups.Items).map((grps) => ({
//     'staging-groups10': grps.map((Item) => ({ PutRequest: { Item } })),
//   }))
// )
// .then((batches) => Promise.all(batches.map(writeBatch)))
