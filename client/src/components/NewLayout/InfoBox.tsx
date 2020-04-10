import React from 'react'
import { usePlaceState, usePlaceMethod } from '../../contexts/StateContext'

const InfoBox = () => {
  const { onSearch } = usePlaceMethod()
  const {
    search: { place },
  } = usePlaceState()

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
    </div>
  )
}

export default InfoBox
