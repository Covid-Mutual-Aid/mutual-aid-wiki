import React from 'react'
import { Table, Column, ListRowRenderer } from 'react-virtualized'
import { useGroups } from '../contexts/GroupsContext'

const GroupsList = () => {
  const groups = useGroups()

  return (
    <Table
      autoHeight={true}
      width={500}
      height={300}
      headerHeight={20}
      rowHeight={30}
      rowCount={groups.length}
      rowGetter={({ index }) => groups[index]}
    >
      <Column label="Name" dataKey="location_name" width={100} />
      <Column width={200} label="Link" dataKey="link_facebook" />
    </Table>
  )
}

export default GroupsList
