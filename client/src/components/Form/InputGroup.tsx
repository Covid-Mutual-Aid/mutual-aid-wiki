import React from 'react'
import styled from 'styled-components'

import { MOON_BLUE } from '../../utils/CONSTANTS'

const InputGroup: React.FC<{ description?: string }> = ({ children, description }) => {
  return (
    <InputGroupStyles>
      {description && <p>{description}</p>}
      {children}
    </InputGroupStyles>
  )
}

export default InputGroup

export const InputGroupStyles = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 40px;
  overflow: hidden;
  display: grid;
  grid: 1fr / 1fr 0fr;

  input:focus {
    outline: none;
  }

  input,
  button {
    height: 2.8rem;
    font-size: 1rem;
    display: flex;
    align-items: center;
    border-radius: 0;
  }

  input {
    outline: none;
    border: none;
    background-color: transparent;
    padding: 0 1rem;
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
