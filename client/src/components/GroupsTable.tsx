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

const GroupsTable = ({ groups, shouldDisplayDistance }: Props) => {
  const { setMapState } = useMap()
  const [mapState] = useMapState()
  const tableWrapper = useRef<HTMLDivElement>(null)
  const link = mapState.group ? mapState.group.link_facebook : ''
  return (
    <div>
      <div
        ref={tableWrapper}
        className="tcb-styled-list thrv_wrapper thrv_table tcb-fixed tcb-mobile-table"
        data-css="tve-u-171214d9098"
      >
        <Table
          className="tve_table tcb-fixed tve_table_flat"
          data-css="tve-u-171214d9099"
          striped
          bordered
          hover
          size="sm"
        >
          <thead data-css="tve-u-171214d909a">
            <tr className="tve_table_row">
              <th className="tve_table_cell">
                <div className="thrv_wrapper thrv_text_element">
                  <p data-css="tve-u-171214d909c">
                    <span>Location</span>
                  </p>
                </div>
              </th>
              <th className="tve_table_cell">
                <div className="thrv_wrapper thrv_text_element">
                  <p data-css="tve-u-171214d909d">Group</p>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {groups.map(({ link_facebook, name, location_name, distance, location_coord }, i) => (
              <tr
                key={i}
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
                      group: { link_facebook, name, location_name, location_coord },
                      center: location_coord,
                    })
                  }}
                >
                  <p>
                    {location_name}{' '}
                    {distance && shouldDisplayDistance ? (
                      <Badge variant="success">{(distance / 1000).toFixed(1) + 'km'}</Badge>
                    ) : (
                      ''
                    )}
                  </p>
                </td>
                <td>
                  <p>
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
                  </p>
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
