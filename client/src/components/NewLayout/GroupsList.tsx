import React, { useState, useLayoutEffect, useReducer } from 'react'
import haversineDistance from 'haversine-distance'
import styled from 'styled-components'

import { useData } from '../../contexts/DataProvider'
import { usePlaceState, usePlaceMethod } from '../../contexts/StateContext'

const GroupsList = () => {
  const [limit, toggleMore] = useReducer((x) => x + 50, 50)
  const { groups } = useData()
  const { onSelect } = usePlaceMethod()
  const {
    search: { place },
    selected,
  } = usePlaceState()

  const selectedGroup = groups.find((x) => x.id === selected)
  const visibleGroups = groups
    .map((g) => ({
      ...g,
      distance: selectedGroup
        ? haversineDistance(selectedGroup.location_coord, g.location_coord)
        : place
        ? haversineDistance(place.coords, g.location_coord)
        : 0,
    }))
    .sort((a, b) => (a.distance > b.distance ? 1 : -1))
    .slice(0, limit)

  return (
    <Styles>
      {visibleGroups.map((group, i) => (
        <GroupWrapper key={group.id} selected={group.id === selected}>
          <div
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}
          >
            <h4 onClick={() => onSelect(group.id)}>{group.name}</h4>
            {group.distance > 0 && (
              <span className="distance">{(group.distance / 1000).toFixed(1) + 'km'}</span>
            )}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p>{group.location_name}</p>
            <a href={group.link_facebook}>link</a>
          </div>
        </GroupWrapper>
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

const GroupWrapper = styled.div<{ selected: boolean }>`
  transition: background 0.3s;
  background-color: white;
  padding: 0.5rem 1rem;
  box-shadow: 0px 0px 20px 0px #d7d7d7;
  position: sticky;
  top: 0;
  & h4 {
    cursor: pointer;
    margin-top: 0;
  }
  & a,
  p {
    margin-bottom: 0;
  }
  & .distance {
    background: green;
    color: white;
    padding: 0.2rem;
    border-radius: 5px;
  }
`

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

// <Table
//       autoHeight={true}
//       width={500}
//       height={300}
//       headerHeight={20}
//       rowHeight={30}
//       rowCount={groups.length}
//       rowGetter={({ index }) => groups[index]}
//     >
//       <Column label="Name" dataKey="location_name" width={100} />
//       <Column width={200} label="Link" dataKey="link_facebook" />
//     </Table>

export default GroupsList
