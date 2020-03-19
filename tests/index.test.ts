import { spawn } from 'child_process'
import { join } from 'path'
import axios from 'axios'

const seededData = require('../lambdas/migrations/groups-seed.json')
let slsOfflineProcess

test('Get all groups', async () => {
  const { data } = await axios.get('http://localhost:4000/dev/groups')
  expect(data.map(x => x.id).sort()).toEqual(seededData.map(x => x.id).sort())
})

// Setup and teardown
jest.setTimeout(30000)
beforeEach(async function() {
  console.log('[Tests Bootstrap] Start')
  return startOffline()
})

afterEach(function() {
  console.log('[Tests Teardown] Start')
  stopSlsOffline()
  console.log('[Tests Teardown] Done')
})

// Helper functions
const startOffline = () =>
  new Promise((res, rej) => {
    slsOfflineProcess = spawn('yarn', ['start'], { cwd: join(__dirname, '../lambdas') })
    console.log(`Serverless: Offline started with PID : ${slsOfflineProcess.pid}`)

    slsOfflineProcess.stdout.on('data', data => {
      if (
        data
          .toString()
          .trim()
          .includes('server ready')
      ) {
        console.log(data.toString().trim())
        res()
      }
    })

    slsOfflineProcess.stderr.on('data', errData => {
      console.log(`Error starting Serverless Offline:\n${errData}`)
      rej(errData)
    })
  })

const stopSlsOffline = () => {
  slsOfflineProcess.kill()
  console.log('Serverless Offline stopped')
}
