import React from 'react'
import { useLocation } from 'react-router-dom'

const Path = ({ route, children }: { route: string; children: React.ReactNode }) => {
  const { pathname } = useLocation()
  if (route !== pathname) return null
  return <>{children}</>
}

export default Path
