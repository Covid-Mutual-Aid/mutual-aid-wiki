import React, { useEffect, useState } from 'react'
import distance from 'haversine-distance'
import styled from 'styled-components'

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
      {open &&
        near &&
        near.map((group) => <GroupItem key={group.id} group={group} highlight={false} />)}
    </DropDownStyles>
  )
}

export default DropDown
const DropDownStyles = styled.div<{ open: boolean }>`
  height: ${(p) => (p.open ? '80vh' : '2rem')};
  background-color: white;
  box-sizing: border-box;
  transition: height 0.3s;
  padding-bottom: 2rem;
  padding: 1rem 0.2rem;
  overflow-y: scroll;
  width: 100%;

  & > div:nth-child(1) {
    margin-top: 3rem;
  }
  button {
    background-color: white;
    align-items: center;
    position: absolute;
    background: white;
    display: flex;
    margin-top: -0.5rem;
    padding: 0.1rem 1rem;
    border-radius: 20px;
    height: 1.8rem;
    z-index: 3;
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
