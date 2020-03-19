import { spawn } from 'child_process'
import { join } from 'path'
import axios from 'axios'

const seededData = require('../lambdas/migrations/groups-seed.json')
let slsOfflineProcess

const newTask = {
  name: 'New Task2',
  link_facebook: 'Link',
  location_name: 'Location',
  id: '4',
  location_coord: { lng: -5.8101207, lat: 54.7261871 },
}

test('Get all groups', async () => {
  const { data: allTasks } = await axios.get('http://localhost:4000/dev/group/get')
  const { data: singleTask } = await axios.get(
    `http://localhost:4000/dev/group/get?id=${allTasks[0].id}`
  )
  await axios.post('http://localhost:4000/dev/group/create', newTask)
  const { data: withNewTask } = await axios.get('http://localhost:4000/dev/group/get')

  expect(allTasks.map(x => x.name).sort()).toEqual(seededData.map(x => x.name).sort())
  expect(allTasks[0]).toEqual(singleTask)
  expect(withNewTask.map(x => x.name).sort()).toEqual(
    [...seededData, newTask].map(x => x.name).sort()
  )
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
