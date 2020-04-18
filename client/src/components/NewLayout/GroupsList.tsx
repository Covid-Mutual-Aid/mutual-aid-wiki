import haversineDistance from 'haversine-distance'
import React, { useReducer } from 'react'
import styled from 'styled-components'

import { useData } from '../../contexts/DataProvider'
import { usePlaceState, usePlaceMethod } from '../../contexts/StateContext'

import GroupItem from './GroupItem'
import { MOON_BLUE } from '../../utils/CONSTANTS'

const GroupsList = ({ closeSidebar }: { closeSidebar: () => void }) => {
  const [limit, toggleMore] = useReducer((x) => x + 50, 50)
  const { groups } = useData()
  const { onSelect } = usePlaceMethod()
  const {
    search: { place },
    selected,
  } = usePlaceState()

  // const selectedGroup = groups.find((x) => x.id === selected)
  const visibleGroups = groups
    .map((g) => ({
      ...g,
      distance: place ? haversineDistance(place.coords, g.location_coord) : 0,
    }))
    .sort((a, b) => (a.distance > b.distance ? 1 : -1))
    .slice(0, limit)

  return (
    <Styles>
      {visibleGroups.map((group, i) => (
        <GroupItem
          selected={group.id === selected}
          group={group}
          key={i}
          onSelect={() => {
            onSelect(group.id)
            closeSidebar()
          }}
        />
      ))}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', margin: '1rem 0' }}>
        {groups.length > 0 && limit < groups.length && (
          <button onClick={toggleMore} type="button">
            load more
          </button>
        )}
      </div>
    </Styles>
  )
}

const Styles = styled.div`
  height: 100%;
  overflow-y: scroll;
  transition: box-shadow 0.3s;
  box-shadow: inset 0px 0px 11px -11px #959595;
  &:hover {
    box-shadow: inset 0px 8px 11px -11px #959595;
  }

  & button {
    background-color: transparent;
    border: none;
    outline: none;
    color: ${MOON_BLUE};
    margin: 0 auto;
  }
`

export default GroupsList
