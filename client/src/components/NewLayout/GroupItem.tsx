import React from 'react'
import { Group } from '../../utils/types'
import styled from 'styled-components'
import tidyLink from '../../utils/tidyLink'
import { iconFromUrl } from '../../utils/icons'

const GroupItem = ({
  group,
  selected,
  onSelect,
}: {
  group: Group & { distance?: number }
  selected: boolean
  onSelect: (...args: any[]) => void
}) => {
  return (
    <GroupWrapper key={group.id} selected={selected}>
      <div className="content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <h4 onClick={() => onSelect(group.id)}>{group.name}</h4>
        </div>
        <p className="location-name">
          {group.location_name}
          {group.distance && group.distance > 0 && (
            <span className="distance">{(group.distance / 1000).toFixed(1) + 'km'}</span>
          )}
        </p>
      </div>
      <div className="visit">
        <a href={tidyLink(group.link_facebook)}>{iconFromUrl(group.link_facebook)}</a>
      </div>
    </GroupWrapper>
  )
}

const GroupWrapper = styled.div<{ selected: boolean }>`
  transition: background 0.3s;
  background: ${(p) => (p.selected ? 'rgba(0, 0, 255, 0.11)' : 'rgba(0, 0, 255, 0);')};
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
    /* justify-content: end; */
    flex-direction: row-reverse;
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

  .location-name {
    font-size: 0.9rem;
    line-height: 1.4;
  }
`
export default GroupItem
