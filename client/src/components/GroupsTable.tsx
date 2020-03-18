import React from 'react'
import { Table } from 'react-bootstrap'
import { Group } from '../utils/types'

type Props = {
  groups: Group[]
}
const GroupsTable = ({ groups }: Props) => {
  return (
    <div className="group-table-wrapper">
      <Table responsive striped bordered hover size="sm">
        <thead>
          <tr>
            <th>Name</th>
            <th>Location</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>
          {groups.map((group, i) => (
            <tr key={i}>
              <td>{group.name}</td>
              <td>{group.location_name}</td>
              <td>
                <a href={group.link_facebook}>link</a>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

export default GroupsTable
