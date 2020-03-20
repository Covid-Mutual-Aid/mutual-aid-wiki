import React from 'react'

import { Table, Badge } from 'react-bootstrap'
import { Group } from '../utils/types'

type GroupWithDistance = Group & {
  distance?: number
}

type Props = {
  groups: GroupWithDistance[]
  shouldDisplayDistance: boolean
}
const GroupsTable = ({ groups, shouldDisplayDistance }: Props) => {
  return (
    <div>
      <div className="group-table-wrapper">
        <Table className="table-fixed" responsive striped bordered hover size="sm">
          <thead>
            <tr>
              <th>Name</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {groups.map(({ link_facebook, name, location_name, distance }, i) => (
              <tr key={i}>
                <td>
                  <a href={link_facebook}>
                    {name} {}
                  </a>
                </td>
                <td>
                  {location_name}{' '}
                  {distance && shouldDisplayDistance ? (
                    <Badge variant="success">{(distance / 1000).toFixed(1) + 'km'}</Badge>
                  ) : (
                    ''
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  )
}

export default GroupsTable
