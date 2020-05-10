import React from 'react'
import icons from '../icons'
import { useGroupsList } from '../../state/reducers/groups'

const HighlightsContentEN = () => {
  const groups = useGroupsList()
  return (
    <div className="wrapper highlights-content">
      <div>
        {icons('git')}
        <h3>Open Source</h3>
        <p>
          All of our code is published with an open source license. We accept pull requests and
          actively rely on the work of volunteers to maintain this project.
        </p>
      </div>
      <div>
        {icons('users')}
        <h3>Community Created</h3>
        <p>
          We are developing this resource together with organising groups from all over the
          world to make sure that this data is used for the benefit of the global mutual aid
          community.
        </p>
      </div>
      <div>
        {icons('globe')}
        <h3>{groups.length} Communities</h3>
        <p>
          This resource currently documents {groups.length} groups from around the world, with
          new groups being added daily. Please get in touch if you would like to sync your data.
        </p>
      </div>
    </div>
  )
}

export default HighlightsContentEN
