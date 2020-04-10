import React from 'react'
import { usePlaceState, usePlaceMethod } from '../../contexts/StateContext'
import { useData } from '../../contexts/DataProvider'

const InfoBox = () => {
  const { groups } = useData()
  const { onSearch } = usePlaceMethod()
  const {
    search: { place },
    selected,
  } = usePlaceState()

  const selectedGroup = groups.find((x) => x.id === selected)
  return (
    <div>
      {place && (
        <>
          <div style={{ padding: '1rem 0' }}>
            show results nearest: <span style={{ fontWeight: 'bold' }}>{place.name}</span>
            <button type="button" className="clear" onClick={() => onSearch()}>
              clear
            </button>
          </div>
        </>
      )}
      {selectedGroup && (
        <>
          <div style={{ padding: '1rem 0' }}>
            <h4>{selectedGroup.name}</h4>
          </div>
        </>
      )}
    </div>
  )
}

export default InfoBox
