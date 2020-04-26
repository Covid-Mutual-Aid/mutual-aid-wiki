import React, { useContext, useEffect, useReducer } from 'react'
import styled from 'styled-components'

import { useFormControl } from '../../../state/selectors'
import { MOBILE_BREAKPOINT } from '../../../utils/CONSTANTS'
import { MapContext } from '../withMap'
import { useMarker } from './useMarker'
import usePolygon from './usePolygon'
import { createSquare } from './utils'

const useEditLocationMap = (disable: boolean) => {
  const [, map, setZoom] = useContext(MapContext)
  const [marker, toggleMaker] = useReducer((x) => !x, true)
  const [poly, togglePoly] = useReducer((x) => !x, false)
  const [coord, onDrag] = useFormControl('location_coord')
  const [path, onChange] = useFormControl('location_poly')

  useMarker(map, { coord, disable: disable || !marker || !coord, onDrag })
  usePolygon(map, { path, onChange, disable: disable || !poly || !coord })

  useEffect(() => {
    if (!coord) return
    setZoom(13)
    map.current?.panTo(coord)
  }, [coord, map, setZoom])

  useEffect(() => {
    if ((path && path.length > 0) || !coord) return
    onChange(createSquare(coord, 1000))
  }, [coord, path, onChange])

  return (
    <Controls
      disable={disable || !coord}
      selected={[marker ? 'marker' : 'none', poly ? 'poly' : 'none']}
      style={{}}
    >
      <button className="marker" onClick={toggleMaker}>
        marker
      </button>
      <button className="poly" onClick={togglePoly}>
        polygon
      </button>
    </Controls>
  )
}

export default useEditLocationMap

const Controls = styled.div<{ disable?: boolean; selected: ('marker' | 'poly' | 'none')[] }>`
  z-index: 1;
  top: ${(p) => (p.disable ? '-10rem' : '0rem')};
  left: calc(50% - (22rem * 0.5));
  width: 18rem;
  box-shadow: 0px 0px 22px -9px #959595;
  background-color: white;
  border-radius: 10px;
  margin: 1rem;
  position: absolute;
  display: flex;
  justify-content: space-between;
  transition: top 0.3s;
  button {
    flex: 1 1 50%;
    border: none;
    background-color: transparent;
    transition: 0.2s;
    border: 1px solid black;
    margin: 1rem;
  }

  ${(p) =>
    p.selected
      .map(
        (key) => `
        .${key} {
          background: #1f1e1e;
          color: white;
        }
      `
      )
      .join('\n')}

  @media (max-width: ${MOBILE_BREAKPOINT + 'px'}) {
    top: initial;
    margin-bottom: 4rem
    transition: bottom 0.3s;
    bottom: 0;
  }
`
