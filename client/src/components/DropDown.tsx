import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import distance from 'haversine-distance'

import { useSelectedGroup, useGroupsList } from '../state/reducers/groups'
import GroupItem from './GroupItem'
import icons from '../utils/icons'

const DropDown = () => {
  const [open, setOpen] = useState(false)
  const selected = useSelectedGroup()
  const groups = useGroupsList()
  const near =
    selected &&
    groups
      .filter((x) => x.id !== selected.id)
      .map((x) => ({ ...x, distance: distance(selected.location_coord, x.location_coord) }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 10)

  useEffect(() => {
    setOpen(false)
  }, [selected])

  return (
    <DropDownStyles open={open}>
      <button onClick={() => setOpen(!open)}>
        <span>near by</span>
        <div>{icons('chevronL')}</div>
      </button>
      {open && near && near.map((group) => <GroupItem group={group} highlight={false} />)}
    </DropDownStyles>
  )
}

export default DropDown
const DropDownStyles = styled.div<{ open: boolean }>`
  height: ${(p) => (p.open ? '80vh' : '2rem')};
  transition: height 0.3s;
  width: 100%;
  background-color: white;
  overflow-y: scroll;
  padding: 0.2rem;
  box-sizing: border-box;

  button {
    background-color: white;
    padding: 0.1rem 1rem;
    height: 1.8rem;
    margin: 0;
    margin-left: 50%;
    position: relative;
    left: -2.5rem;
    display: flex;
    align-items: center;
    border-radius: 20px;
    margin-bottom: 0.2rem;
    position: sticky;
    top: 0;
    background: white;
    & > div {
      transform: rotateZ(${(p) => (p.open ? '90deg' : '-90deg')});
      transition: transform 0.3s;
    }
    &:active,
    &:visited,
    &:focus {
      border: 1px solid blue;
      outline: none;
    }
    span {
      position: relative;
      top: -0.15rem;
      padding: 0 0.2rem;
    }
  }
`
