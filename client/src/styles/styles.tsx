import styled from 'styled-components'
import { MOBILE_BREAKPOINT } from '../utils/CONSTANTS'

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
