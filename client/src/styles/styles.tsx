import styled from 'styled-components'
import { MOON_BLUE } from '../utils/CONSTANTS'

export const TextWrapper = styled.div`
  max-width: 30rem;
`

export const InputGroup = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 40px;
  overflow: hidden;
  display: flex;
  align-items: center;

  input:focus {
    outline: none;
  }

  input,
  button {
    height: 100%;
  }

  input {
    width: calc(100% - 4rem);
    outline: none;
    border: none;
    background-color: transparent;
    padding: 0.5rem 1rem;
  }
  button {
    border: none;
    border-left: 1px solid rgba(0, 0, 0, 0.2);
    height: 2.8rem;
    width: 4rem;
    padding: 0;
    outline: none;
    background-color: transparent;
    color: ${MOON_BLUE};
  }
`
