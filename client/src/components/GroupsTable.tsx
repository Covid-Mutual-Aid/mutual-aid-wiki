import React from 'react'
import { Table, Badge } from 'react-bootstrap'

import { Group, gtag } from '../utils/types'
import { useMap } from '../contexts/MapProvider'
import TrackedLink from '../utils/TrackedLink'

type GroupWithDistance = Group & {
  distance?: number
}

type Props = {
  groups: GroupWithDistance[]
  shouldDisplayDistance: boolean
}

const GroupsTable = ({ groups, shouldDisplayDistance }: Props) => {
  const { setMapState } = useMap()
  return (
    <div>
      <div className="table-wrapper">
        <Table className="table-fixed" responsive striped bordered hover size="sm">
          <thead>
            <tr>
              <th>Location</th>
              <th>Group</th>
            </tr>
          </thead>
          <tbody>
            {groups.map(({ link_facebook, name, location_name, distance, location_coord, id }) => (
              <tr key={id}>
                <td
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    gtag('event', 'Clicked location in row', {
                      event_category: 'Table',
                      event_label: 'Click location',
                    })
                    setMapState({
                      zoom: 11,
                      group: { id, link_facebook, name, location_name, location_coord },
                      center: location_coord,
                    })
                  }}
                >
                  {location_name}{' '}
                  {distance && shouldDisplayDistance ? (
                    <Badge variant="success">{(distance / 1000).toFixed(1) + 'km'}</Badge>
                  ) : (
                    ''
                  )}
                </td>
                <td>
                  <a
                    onClick={() =>
                      gtag('event', 'Visit facebook group', {
                        event_category: 'Table',
                        event_label: 'Click group url',
                      })
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    href={link_facebook}
                  >
                    {name}
                  </a>
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
