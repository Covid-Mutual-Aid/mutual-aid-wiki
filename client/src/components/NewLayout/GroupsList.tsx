import React, { useState, useLayoutEffect, useReducer } from 'react'
import haversineDistance from 'haversine-distance'
import styled from 'styled-components'

import { useData } from '../../contexts/DataProvider'
import { usePlaceState, usePlaceMethod } from '../../contexts/StateContext'

import icons from '../../utils/icons'

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
        <GroupWrapper key={group.id} selected={group.id === selected}>
          <div className="content">
            <div
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}
            >
              <h4 onClick={() => onSelect(group.id)}>{group.name}</h4>
            </div>
            <p>
              {group.location_name}
              {group.distance > 0 && (
                <span className="distance">{(group.distance / 1000).toFixed(1) + 'km'}</span>
              )}
            </p>
          </div>
          <div className="visit">
            {((url) => (
              <a href={url.includes('http') ? url : 'http://' + url}>
                {url.includes('whatsapp')
                  ? icons('wa', 'green')
                  : url.includes('facebook')
                  ? icons('fb', 'blue')
                  : icons('link')}
              </a>
            ))(group.link_facebook ? group.link_facebook : '')}
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
  background: ${(p) => (p.selected ? 'rgba(255, 0, 0, 0.11)' : 'rgba(255, 0, 0, 0);')};
  padding: 0.8rem 1rem;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  line-height: 0.8;

  display: flex;
  flex-direction: row;

  .content {
    width: calc(100% - 4rem);
  }

  .visit {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 4rem;
  }

  .visit a {
    opacity: 0.6;
    transition: all 0.2s;
  }

  .visit a:hover {
    opacity: 1;
  }

  &:first-child {
    border-top: none;
  }
  & h4 {
    cursor: pointer;
    margin-top: 0;
    font-size: 1.2rem;
    color: rgba(0, 0, 0, 0.8);
  }
  & h4:hover {
    cursor: pointer;
    margin-top: 0;
    font-size: 1.2rem;
    color: rgba(0, 0, 0, 1);
  }
  & a,
  p {
    margin-bottom: 0;
    color: rgba(0, 0, 0, 0.6);
  }
  & .distance {
    color: rgba(21, 158, 21, 0.71);
    padding: 0.2rem;
    font-weight: 800;
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
