import CreatableSelect from 'react-select/creatable'
import React, { useState } from 'react'

import { useI18n } from '../contexts/I18nProvider'
import { useFormControl } from '../state/selectors'

const EmailsInput = () => {
  const t = useI18n((locale) => locale.translation.components.emails_input)
  const [emails, onChange] = useFormControl('emails', [] as string[])
  const [value, setValue] = useState('')
  const [error, setError] = useState('')
  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (!value) return
    setError('')
    switch (event.key) {
      case 'Enter':
      case ' ':
      case ',':
      case 'Tab':
        if (!validEmail(value)) {
          setError(t.errors.wrong_format)
        } else {
          onChange([...emails, value])
          setValue('')
        }
        if (event.preventDefault) event.preventDefault()
    }
  }
  return (
    <div>
      <CreatableSelect
        components={{ DropdownIndicator: null }}
        styles={{
          control: (x) => ({ ...x, borderRadius: '20px', padding: '.4rem' }),
        }}
        inputValue={value}
        isClearable
        isMulti
        menuIsOpen={false}
        onChange={(x) => onChange(Array.isArray(x) ? x.map((y) => y.value) : [])}
        onBlur={() => handleKeyDown({ key: 'Tab' } as any)}
        onInputChange={setValue}
        onKeyDown={handleKeyDown}
        placeholder={t.placeholder}
        value={emails.map((x) => ({ label: x, value: x }))}
      />
      <p style={{ paddingLeft: '1rem', margin: '.4rem 0rem 0rem 0rem', color: 'red' }}>{error}</p>
    </div>
  )
}

export default EmailsInput

export function validEmail(email: string) {
  var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}
