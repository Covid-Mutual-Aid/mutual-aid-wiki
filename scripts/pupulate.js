const axios = require('axios')

const groups = JSON.parse(require('../groups.json').body)
const endpoint = require('../stack.json').ServiceEndpoint

const groupBy = (n, items, grouped = []) =>
  items.length < 1 ? grouped : groupBy(n, items.slice(n), [...grouped, items.slice(0, n)])

groupBy(100, groups).reduce(
  (a, b) =>
    a.then(() =>
      axios.post(`${endpoint}/group/createbatch`, b).catch(console.log).then(console.log)
    ),
  Promise.resolve()
)
