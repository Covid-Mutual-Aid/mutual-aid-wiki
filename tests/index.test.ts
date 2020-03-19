import { spawn, spawnSync } from 'child_process'
import { join } from 'path'
import axios from 'axios'

const seededData = require('../lambdas/migrations/groups-seed.json')

const newTask = {
  name: 'New Task2',
  link_facebook: 'Link',
  location_name: 'Location',
  id: '4',
  location_coord: { lng: -5.8101207, lat: 54.7261871 },
}

test('Get all groups', async () => {
  const { data: allTasks } = await axios.get('http://localhost:4000/dev/group/get')
  expect(allTasks.map(x => x.name).sort()).toEqual(seededData.map(x => x.name).sort())

  const { data: singleTask } = await axios.get(
    `http://localhost:4000/dev/group/get?id=${allTasks[0].id}`
  )
  expect(allTasks[0]).toEqual(singleTask)

  await axios.post('http://localhost:4000/dev/group/create', newTask)
  const { data: withNewTask } = await axios.get('http://localhost:4000/dev/group/get')
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

afterEach(function(done) {
  console.log('[Tests Teardown] Start')
  stopSlsOffline(done as any)
  console.log('[Tests Teardown] Done')
})

// Helper functions
let slsOfflineProcess
let dynamoDB

const startOffline = () =>
  new Promise((res, rej) => {
    dynamoDB = spawn('yarn', ['start:db'], { cwd: join(__dirname, '../') })
    console.log(`dynamodb: started with PID : ${dynamoDB.pid}`)

    dynamoDB.stdout.on('data', data => {
      console.log(data.toString().trim())
      if (
        data
          .toString()
          .trim()
          .includes('Dynamodb Local Started')
      ) {
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
      }
    })
  })

const stopSlsOffline = (done: any) => {
  slsOfflineProcess.kill()
  dynamoDB.kill()
  spawnSync('pkill', ['java'])
  setTimeout(() => done(), 1000)
}
