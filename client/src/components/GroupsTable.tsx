import React from 'react'

import { Table } from 'react-bootstrap'
import { Group } from '../utils/types'

type GroupWithDistance = Group & {
  distance?: number
}

type Props = {
  groups: GroupWithDistance[]
}
const GroupsTable = ({ groups }: Props) => {
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
                  {location_name} {distance ? '(' + distance / 1000 + 'km)' : ''}
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
