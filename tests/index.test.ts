import { spawn } from 'child_process'
import { join } from 'path'
let slsOfflineProcess

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

test('cool', () => {
  console.log('SLS OFFLINE')
})
// Helper functions
const startOffline = () =>
  new Promise((res, rej) => {
    slsOfflineProcess = spawn('sls', ['offline', 'start'], { cwd: join(__dirname, '../lambdas') })
    console.log(`Serverless: Offline started with PID : ${slsOfflineProcess.pid}`)

    slsOfflineProcess.stdout.on('data', data => {
      if (
        data
          .toString()
          .trim()
          .includes('listening on http://')
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
