import React from 'react'

import { Table } from 'react-bootstrap'
import { Group } from '../utils/types'

type Props = {
  groups: Group[]
}
const GroupsTable = ({ groups }: Props) => {
  return (
    <div>
      <Table className="table-fixed" responsive striped bordered hover size="sm">
        <thead>
          <tr>
            <th>Name</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          {groups.map((group, i) => (
            <tr key={i}>
              <td>
                <a href={group.link_facebook}>{group.name}</a>
              </td>
              <td>{group.location_name}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

export default GroupsTable
