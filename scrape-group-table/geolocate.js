require('dotenv').config()

let fs = require('fs')
let axios = require('axios')

const filename = 'groups-seed.json'

// https://stackoverflow.com/questions/21987909/how-to-get-the-difference-between-two-arrays-of-objects-in-javascript
function diff(otherArray) {
  return current => {
    return (
      otherArray.filter(other => {
        return other.link_facebook == current.link_facebook //other.value == current.value && other.display == current.display
      }).length == 0
    )
  }
}

const scrapedGroups = JSON.parse(fs.readFileSync(filename, 'utf8'))
const existingGeolocatedGroups = JSON.parse(fs.readFileSync('geolocated-' + filename, 'utf8'))
const nonGeolocatedGroups = scrapedGroups.filter(diff(existingGeolocatedGroups))

console.log(nonGeolocatedGroups)

console.log('Geolocating:')
const geolocatedGroupPromises = nonGeolocatedGroups.map(group => {
  const term = encodeURIComponent(group.location_name)
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${term}&key=${process.env.GOOGLE_API_KEY}`
  return axios({ url, timeout: 40000 })
    .then(response => {
      const geolocated = {
        ...group,
        location_coord: {
          lat: '' + response.data.results[0].geometry.location.lat, //Coerce into string for dynamoDB
          lng: '' + response.data.results[0].geometry.location.lng,
        },
      }
      console.log(geolocated)
      return geolocated
    })
    .catch(err => {
      console.log('Error with geolocating: ', term)
    })
})

console.log('Writing:')
Promise.all(geolocatedGroupPromises).then(newlyGeolocatedGroups => {
  const allGeolocatedGroups = existingGeolocatedGroups.concat(newlyGeolocatedGroups)
  fs.writeFileSync('geolocated-' + filename, JSON.stringify(allGeolocatedGroups.filter(g => g)))

  console.log('')
  console.log('There were ' + scrapedGroups.length + ' scrapedGroups already')
  console.log('There were ' + existingGeolocatedGroups.length + ' existingGeolocatedGroups already')
  console.log(+newlyGeolocatedGroups.length + ' were geolocated.')
  console.log('Done.')
})
