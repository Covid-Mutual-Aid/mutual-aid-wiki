import 'source-map-support/register'

import { getGroups, addGroup } from './src/database'
import { lambda } from './src/utils'

export const groups = lambda(getGroups)

export const createGroup = lambda(event => addGroup(JSON.parse(event.body as string)), {
  body: {
    name: 'string',
    link_facebook: 'string',
    location_name: 'string',
  },
})
