import styled from 'styled-components'
import { MOON_BLUE, MOBILE_BREAKPOINT } from '../utils/CONSTANTS'

export const EditPage = styled.div`
  @media (max-width: ${MOBILE_BREAKPOINT + 'px'}) {
    grid: 1fr / 1fr;

    .preview {
      display: hidden;
    }
  }
`

export const TextWrapper = styled.div`
  max-width: 30rem;
`

export const CenterAlign = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column;
  height: 100vh;
`

export const InputGroup = styled.div`
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
  }
`

export const Button = styled.div<{ variant?: 'primary' | 'secondary' }>`
  background-color: ${({ variant }) => (variant === 'primary' ? 'blue' : 'lightgrey')};
  color: ${({ variant }) => (variant === 'primary' ? 'white' : 'grey')};
  border-radius: 4px;
  padding: 0.6rem 0.8rem;

  a {
    text-decoration: none;
    color: inherit;
  }
`

export const FormButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 1rem 0;

  button {
    margin: 0 0.4rem;
  }
`
