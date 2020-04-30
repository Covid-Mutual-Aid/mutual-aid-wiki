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
  const [poly, togglePoly] = useReducer((x) => !x, false)
  const [coord, onDrag] = useFormControl('location_coord')
  const [path, onChange] = useFormControl('location_poly')

  const pth = path || (coord ? createSquare(coord, 700) : [])
  useMarker(map, { coord, disable: disable || !coord, onDrag })
  usePolygon(map, { path: pth, onChange, editable: true, disable: disable || !poly || !coord })

  useEffect(() => {
    if (!coord) return
    setZoom(13)
    map.current?.panTo(coord)
  }, [coord, map, setZoom])

  return (
    <Controls disable={disable || !coord} active={poly} style={{}}>
      Include area
      <button
        className="poly"
        onClick={() => {
          togglePoly()
          onChange(undefined)
        }}
      />
    </Controls>
  )
}

export default useEditLocationMap

const Controls = styled.div<{ disable?: boolean; active: boolean }>`
  z-index: 1;
  bottom: ${(p) => (p.disable ? '-10rem' : '4rem')};
  left: calc(50% - (22rem * 0.5));
  width: 15rem;
  box-shadow: 0px 0px 22px -9px #959595;
  background-color: white;
  border-radius: 25px;
  margin: 1rem;
  position: absolute;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0.8rem;
  transition: top 0.3s;
  button {
    transition: background-color ease-in-out 0.3s;
    background-color: ${(p) => (p.active ? '#007cff' : '#aeacac')};
    border-radius: 25px;
    transition: 0.2s;
    height: 2.5rem;
    width: 4.5rem;
    &:after {
      content: '';
      position: absolute;
      border-radius: 25px;
      width: 2.1rem;
      height: 2.1rem;
      background: white;
      margin-top: -1.05rem;
      transition: margin ease-in-out 0.3s;
      margin-left: ${(p) => (p.active ? '0rem' : '-2rem')};
    }
  }

  @media (max-width: ${MOBILE_BREAKPOINT + 'px'}) {
    top: initial;
    bottom: ${(p) => (p.disable ? '-10rem' : '4rem')};
    transition: bottom 0.3s;
  }
`
