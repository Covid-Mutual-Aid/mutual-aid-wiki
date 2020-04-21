import React, { useState } from 'react'

import { useRequest } from '../contexts/RequestProvider'
import GroupItem from '../components/NewLayout/GroupItem'
import { EditPage, CenterAlign } from '../styles/styles'
import EditGroupForm from '../components/EditGroupForm'
import { GroupWithEmails } from '../utils/types'

const CreateGroup = () => {
  const request = useRequest()

  const [group, setGroup] = useState<GroupWithEmails>()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    request('/group/create', { method: 'POST', body: JSON.stringify({}) }).then((x) => {})
  }

  return (
    <EditPage>
      <div className="main">
        <CenterAlign>
          <EditGroupForm
            group={{
              name: '',
              emails: [],
              location_name: '',
              link_facebook: '',
              location_coord: {
                lat: 0,
                lng: 0,
              },
            }}
            onSave={console.log}
          />
        </CenterAlign>
      </div>

      <div className="preview">
        <CenterAlign>
          <div className="item">
            {group && (
              <GroupItem
                onSelect={() => null}
                selected={false}
                group={{ ...group, id: '1234567890' }}
                disableDropdown={true}
              />
            )}
          </div>
        </CenterAlign>
      </div>
    </EditPage>
  )
}

export default CreateGroup
