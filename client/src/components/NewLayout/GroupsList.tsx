import React, { useState, useLayoutEffect, useReducer } from 'react'
import styled from 'styled-components'

import { useMapControls } from '../../contexts/MapProvider'
import { useGroups } from '../../contexts/GroupsContext'
import haversineDistance from 'haversine-distance'
import { useSearch } from '../../contexts/SearchContext'

const GroupsList = () => {
  const [limit, toggleMore] = useReducer((x) => x + 50, 50)
  const { panTo, zoomTo } = useMapControls()
  const { groups, setSelected } = useGroups()
  const { place } = useSearch()

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
        <div key={group.name + i}>
          <h4
            onClick={() => {
              setSelected(group)
            }}
          >
            {group.name}
          </h4>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p>{group.location_name}</p>
            <a href={group.link_facebook}>link</a>
          </div>
        </div>
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
  padding: 0 1rem;
  overflow-y: scroll;
  padding-top: 2rem;
  transition: box-shadow 0.3s;
  box-shadow: inset 0px 0px 11px -11px #959595;
  &:hover {
    box-shadow: inset 0px 8px 11px -11px #959595;
  }
  & h4 {
    cursor: pointer;
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
