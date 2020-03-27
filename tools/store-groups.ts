import { writeFileSync } from 'fs'
import { join } from 'path'
import axios from 'axios'

const groupsFile = join(__dirname, '../groups.json')
const getdata = () =>
  axios
    .get('https://sn29v7uuxi.execute-api.eu-west-2.amazonaws.com/dev/group/get')
    .then(({ data }) => {
      console.log(`Downloaded ${data.length} groups for backup`)
      writeFileSync(groupsFile, JSON.stringify(data), 'utf8')
    })

getdata().then(() => {})
