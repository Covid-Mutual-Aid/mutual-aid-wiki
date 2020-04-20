import haversineDistance from 'haversine-distance'
import React, { useReducer } from 'react'
import styled from 'styled-components'

import { usePlaceState, usePlaceMethod } from '../contexts/StateContext'
import { useData } from '../contexts/DataProvider'
import { useI18n } from '../contexts/I18nProvider'

import { MOON_BLUE } from '../utils/CONSTANTS'
import isIosSafari from '../utils/isIosSafari'
import GroupItem from './GroupItem'

const GroupsList = ({ closeSidebar }: { closeSidebar: () => void }) => {
  const  t = useI18n(locale => locale.translation.components.groups_list)
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
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          margin: isIosSafari() ? '4rem 0 12rem 0' : '4rem 0 6rem 0',
        }}
      >
        {groups.length > 0 && limit < groups.length && (
          <button
            style={{ fontSize: '1rem', cursor: 'pointer' }}
            onClick={toggleMore}
            type="button"
          >
            {t.load_more_prompt}
          </button>
        )}
      </div>
    </Styles>
  )
}

const Styles = styled.div`
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
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
