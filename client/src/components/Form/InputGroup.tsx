import React from 'react'
import styled, { css } from 'styled-components'

import useDelayedValue from '../../hooks/useDelayedValue'
import { MOON_BLUE } from '../../utils/CONSTANTS'

const InputGroup: React.FC<{
  description?: React.ReactNode
  label?: string
  error?: React.ReactNode
  custom?: React.ReactNode
}> = ({ children, description, error, custom, label }) => {
  const delayed = useDelayedValue(error, 300, !error)
  return (
    <>
      {description && <p style={{ padding: '0rem .5rem .5rem .5rem', margin: 0 }}>{description}</p>}
      {label && <Small>{label}</Small>}
      <InputGroupStyles custom={!!custom}>{custom || children}</InputGroupStyles>
      <Error active={!!error}>{delayed}</Error>
    </>
  )
}

export default InputGroup

export const Small = styled.p`
  padding: 0rem 1.1rem 0.25rem 1.1rem;
  border-radius: 25px 25px 0px 0px;
  color: #6d6d6d;
  display: inline-block;
  font-size: 0.85rem;
  position: relative;
  margin: 0;
`

export const InputGroupStyles = styled.div<{ custom: boolean }>`
  border: 1px solid rgba(0, 0, 0, 0.2);
  /* box-shadow: 0px 4px 5px -1px #e6e6e6; */
  border-radius: 25px;
  display: grid;
  grid: 1fr / 1fr 0fr;
  position: relative;
  z-index: 2;
  background-color: white;

  ${(p) => (p.custom ? '' : inputStyles)}
`

const Error = styled.p<{ active: boolean }>`
  margin: 0;
  padding: 0.1rem 1rem 0.3rem 1rem;
  text-align: center;
  font-size: 0.8rem;
  height: 0.8rem;
  z-index: 1;
  transition: transform 0.3s;
  transform: translateY(${(p) => (p.active ? '0rem' : '-1.1rem')});
  color: red;
`

const inputStyles = css`
  textarea,
  input,
  button {
    height: 2.8rem;
    font-size: 1rem;
    display: flex;
    align-items: center;
    border-radius: 0;
  }

  textarea,
  input {
    outline: none;
    border: none;
    background-color: transparent;
    padding: 0 1rem;
    &:focus {
      outline: none;
    }
  }

  textarea {
    padding: 0.8rem;
  }

  button {
    cursor: pointer;
    border: none;
    border-left: 1px solid rgba(0, 0, 0, 0.2);
    padding: 1rem;
    outline: none;
    background-color: transparent;
    color: ${MOON_BLUE};
    position: relative;
    top: -0.25rem;
  }
`
