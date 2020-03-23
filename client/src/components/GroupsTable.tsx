import React, { useRef } from 'react'
import { Table, Badge } from 'react-bootstrap'

import { Group } from '../utils/types'
import { useMap, useMapState } from '../contexts/MapProvider'
import { gtag } from '../utils/gtag'

type GroupWithDistance = Group & {
  distance?: number
}

type Props = {
  groups: GroupWithDistance[]
  shouldDisplayDistance: boolean
}

// row background rgba(0, 123, 255, 0.2)

const GroupsTable = ({ groups, shouldDisplayDistance }: Props) => {
  const { setMapState } = useMap()
  const [mapState] = useMapState()
  const tableWrapper = useRef<HTMLDivElement>(null)
  // console.log(mapState)
  const link = mapState.group ? mapState.group.link_facebook : ''
  return (
    <div>
      <div ref={tableWrapper} className="table-wrapper">
        <Table className="table-fixed" responsive striped bordered hover size="sm">
          <thead>
            <tr>
              <th>Location</th>
              <th>Group</th>
            </tr>
          </thead>
          <tbody>
            {groups.map(({ link_facebook, name, location_name, distance, location_coord, id }) => (
              <tr
                key={id}
                style={link === link_facebook ? { backgroundColor: 'rgba(0, 123, 255, 0.2)' } : {}}
              >
                <td
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    gtag('event', 'Clicked location in row', {
                      event_category: 'Table',
                      event_label: 'Click location',
                    })
                    if (tableWrapper.current) {
                      tableWrapper.current.scrollTo(0, 0)
                    }

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
      <div className="scroll-overlay"></div>
    </div>
  )
}

export default GroupsTable
