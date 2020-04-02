import Pusher from 'pusher'
import { PUSHER_KEY, PUSHER_SECRET } from './utils'

const pusher = new Pusher({
  appId: '975122',
  key: PUSHER_KEY,
  secret: PUSHER_SECRET,
  cluster: 'eu',
  encrypted: true,
})

export const triggorLocationSearch = (coords: any) =>
  pusher.trigger('search', 'location', {
    message: coords,
  })
