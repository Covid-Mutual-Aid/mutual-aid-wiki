import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

import icons, { iconFromUrl } from '../../utils/icons'
import tidyLink from '../../utils/tidyLink'
import { Group } from '../../utils/types'
import { useHistory } from 'react-router-dom'

const GroupItem = ({
  group,
  selected,
  onSelect,
  disableDropdown = false,
}: {
  group: Group & { distance?: number }
  selected: boolean
  onSelect: (...args: any[]) => void
  disableDropdown?: boolean
}) => {
  const history = useHistory()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (isOpen) setTimeout(() => setIsOpen(false), 6000)
  })

  return (
    <GroupWrapper key={group.id} selected={selected}>
      <div className="content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <h4 onClick={() => onSelect(group.id)}>
            {group.name === '' ? 'Your group name...' : group.name}
          </h4>
        </div>
        <span className="location-name">
          {group.location_name === '' ? 'Your group location...' : group.location_name}
          {group.distance && group.distance > 0 ? (
            <span className="distance">{(group.distance / 1000).toFixed(1) + 'km'}</span>
          ) : null}
        </span>
      </div>
      <div className="actions">
        <div style={{ display: !disableDropdown && isOpen ? 'block' : 'none' }} className="menu">
          <div onMouseDown={(e) => history.push(`/edit/${group.id}`)}>Edit group</div>
          <div onMouseDown={(e) => history.push(`/report/${group.id}`)}>Report group</div>
        </div>
        <div
          className="more"
          tabIndex={1}
          onClick={(e) => setIsOpen(!isOpen)}
          onBlur={(e) => setIsOpen(false)}
        >
          {icons('more', 'rgba(0,0,0,0.2')}
        </div>
        <a target="_blank" href={tidyLink(group.link_facebook)}>
          {iconFromUrl(group.link_facebook)}
        </a>
      </div>
    </GroupWrapper>
  )
}

const GroupWrapper = styled.div<{ selected: boolean }>`
  position: relative;
  transition: background 0.3s;
  background: ${(p) => (p.selected ? 'rgba(0, 0, 255, 0.11)' : 'inherit;')};
  padding: 0.5rem 1rem;
  border-top: 1px solid rgba(0, 0, 0, 0.06);

  display: flex;
  flex-direction: row;
  justify-content: space-between;

  .content {
    width: calc(100% - 2rem);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .actions {
    display: flex;
    flex-direction: column;
    align-items: end;
    justify-content: space-between;
  }

  .actions a {
    opacity: 0.6;
    transition: all 0.2s;
  }

  .actions a:hover {
    opacity: 1;
  }

  .menu {
    position: absolute;
    top: 0;
    right: 0;
    box-shadow: 0px 0px 22px -9px #959595;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    z-index: 2;
    background-color: white;
    margin: 1.8rem 0.6rem;
  }

  .menu div {
    cursor: pointer;
    font-size: 0.8rem;
    padding: 0.6rem;
  }

  .menu div:hover {
    background-color: rgba(0, 0, 255, 0.06);
  }

  .more {
    cursor: pointer;
    height: 1rem;
    margin-top: -0.5rem;
  }

  .more:focus {
    outline: none;
  }

  &:first-child {
    border-top: none;
  }
  & h4 {
    cursor: pointer;
    margin-top: 0;
    font-size: 1.12rem;
    font-weight: 400;
    word-wrap: break-word;
    word-break: break-word;
    color: rgba(0, 0, 0, 0.8);
    margin-bottom: 0.28rem;
  }
  & h4:hover {
    color: rgba(0, 0, 0, 1);
  }
  & a,
  span {
    margin-bottom: 0;
    color: rgba(0, 0, 0, 0.6);
  }
  & .distance {
    color: rgba(21, 158, 21, 0.71);
    padding: 0.2rem;
    font-weight: 800;
    border-radius: 5px;
  }

  .location-name {
    font-size: 0.9rem;
    line-height: 1.4;
  }
`
export default GroupItem
