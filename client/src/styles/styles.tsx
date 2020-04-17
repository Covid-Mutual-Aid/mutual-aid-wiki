import styled from 'styled-components'
import { MOON_BLUE } from '../utils/CONSTANTS'

export const EditPage = styled.div`
  display: grid;
  grid: 1fr / 4fr 3fr;

  .main {
    border-right: 1px solid rgba(0, 0, 0, 0.1);
  }

  .item {
    border: 1px solid rgba(0, 0, 0, 0.1);
    box-shadow: 0px 0px 22px -9px #959595;
    padding: 1rem;
    border-radius: 8px;
    width: 100%;
    min-width: 12rem;
    max-width: 22rem;
    margin: 2rem;
  }
`

export const TextWrapper = styled.div`
  max-width: 30rem;
`

export const CenterAlign = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
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
    font-size: 1rem;
  }

  input {
    width: calc(100% - 4rem);
    outline: none;
    border: none;
    background-color: transparent;
    padding: 0.5rem 1rem;
  }

  button {
    cursor: pointer;
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
