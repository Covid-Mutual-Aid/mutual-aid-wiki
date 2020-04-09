import React, { useRef, useState, useEffect } from 'react'
import { Table, Badge } from 'react-bootstrap'

import styled from 'styled-components'

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
  const [displayCount, setDisplayCount] = useState(31)
  const [currentGroups, setCurrentGroups] = useState(groups.slice(0, displayCount))
  const link = mapState.group ? mapState.group.link_facebook : ''

  useEffect(() => {
    setCurrentGroups(groups.slice(0, displayCount))
  }, [groups, displayCount])

  return (
    <Wrapper>
      <div className="headers">
        <div>Location</div>
        <div>Group</div>
      </div>
      <div className="groups-list">
        {currentGroups.map(
          ({ link_facebook, name, location_name, distance, location_coord }, i) => (
            <div
              key={i}
              className="group-row"
              style={{ backgroundColor: link === link_facebook ? 'rgba(0, 123, 255, 0.2)' : '' }}
            >
              <div
                className="location"
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
                {location_name}{' '}
                {distance && shouldDisplayDistance ? (
                  <Badge variant="success">{(distance / 1000).toFixed(1) + 'km'}</Badge>
                ) : (
                  ''
                )}
              </div>
              <div>
                <a
                  className="thrive-a"
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
              </div>
            </div>
          )
        )}
        <div className="more" onClick={() => setDisplayCount((c) => c + 30)}>
          <span className="thrive-a">Show more groups</span>
        </div>
      </div>
      <div className="scroll-overlay"></div>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: grid;
  grid: 0fr 1fr 0fr/ 1fr;
  height: 100%;

  .headers {
    top: 0;
    width: 100%;
    display: flex;
    flex-direction: row;
    position: absolute;
    text-align: center;
  }

  .headers div {
    width: 50%;
    background-color: rgb(236, 249, 249);
    border: 1px solid rgb(0, 79, 202);
    height: 3rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .headers div:nth-child(2) {
    border-left: none;
  }

  .groups-list {
    margin-top: 3rem;
    position: relative;
    height: 45vh;
    overflow-y: scroll;
  }

  .group-row {
    display: flex;
    flex-direction: row;
  }

  .group-row:nth-child(2n + 1) {
    background-color: rgba(0, 0, 0, 0.05);
  }

  .group-row div {
    width: 50%;
    padding: 0.6rem 1rem;
  }

  .location {
    cursor: pointer;
  }

  .more {
    padding: 2rem;
    padding-bottom: 6rem;
    text-align: center;
  }
`

export default GroupsTable
