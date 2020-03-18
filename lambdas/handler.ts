import 'source-map-support/register'

import {
  getGroups,
  removeGroup,
  getGroup as _getGroup,
  createGroup as _createGroup,
} from './src/database'
import { lambda, lambdaPost } from './src/utils'

export const groups = lambda(getGroups)
export const getGroup = lambdaPost(_getGroup, { id: 'string' })

export const createGroup = lambdaPost(_createGroup, {
  name: 'string',
  link_facebook: 'string',
  location_name: 'string',
})
export const deleteGroup = lambdaPost(removeGroup, { id: 'string' })
