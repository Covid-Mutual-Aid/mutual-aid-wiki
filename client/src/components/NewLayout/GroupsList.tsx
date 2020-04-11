import React, { useState, useLayoutEffect, useReducer } from 'react'
import haversineDistance from 'haversine-distance'
import styled from 'styled-components'

import { useData } from '../../contexts/DataProvider'
import { usePlaceState, usePlaceMethod } from '../../contexts/StateContext'

import { iconFromUrl } from '../../utils/icons'
import tidyLink from '../../utils/tidyLink'
import GroupItem from './GroupItem'

const GroupsList = () => {
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
          onSelect={() => onSelect(group.id)}
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
    color: blue;
    margin: 0 auto;
  }
`

const useElementBounds = <T extends HTMLElement>(ref: React.RefObject<T>, init = 100) => {
  const [bounds, setBounds] = useState<{ width: number; height: number }>({
    width: init,
    height: init,
  })
  useLayoutEffect(() => {
    if (!ref.current) return
    setBounds({ height: ref.current.offsetHeight, width: ref.current.offsetWidth })
  }, [ref])

  return bounds
}

export default GroupsList
