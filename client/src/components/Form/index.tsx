import TextareaAutosize from 'react-textarea-autosize'
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { useFormControl, useFormValues } from '../../state/selectors'
import { useI18n } from '../../contexts/I18nProvider'
import InputGroup, { Small } from './InputGroup'
import { Group } from '../../utils/types'
import EmailsInput from './EmailsInput'
import Location from '../Location'

const GroupForm = ({
  onSave,
  disabled,
  noValidate,
}: {
  disabled?: boolean
  noValidate?: boolean
  onSave: (group: Group) => void
}) => {
  const [error, setError] = useState('')
  const values = useFormValues()
  const t = useI18n((locale) => locale.translation.components)

  const validate: Partial<{ [Key in keyof Group]: (x: Group[Key]) => true | string }> = {
    name: (x) => x.length > 0 || t.group_form_elements.name.errors.none_provided,
    link_facebook: (x) => validURL(x) || t.group_form_elements.url.errors.none_provided,
    emails: (x) => !!(x && x.length > 0) || t.emails_input.errors.none_provided,
    location_name: (x) => x.length > 0 || t.location.errors.none_provided,
  }

  useEffect(() => {
    setError('')
  }, [values])

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const error = (Object.keys(values) as (keyof typeof values)[]).reduce(
      (all, key) =>
        typeof all === 'string'
          ? all
          : (validate as any)[key]
          ? (validate as any)[key](values[key])
          : true,
      true
    )
    if (typeof error === 'string' && !noValidate) return setError(error)
    return onSave(values as Group)
  }

  return (
    <FormWrapper>
      <Form onSubmit={onSubmit}>
        <p style={{ padding: '0 1rem', marginBottom: '2rem' }}>
          {t.group_form_elements.introduction}
        </p>
        <Input
          disabled={disabled}
          name="name"
          placeholder={t.group_form_elements.name.placeholder}
          label={'*' + t.group_form_elements.name.label}
        />
        <Input
          disabled={disabled}
          name="link_facebook"
          label={t.group_form_elements.url.label}
          placeholder={t.group_form_elements.url.placeholder}
        />

        <InputGroup label={t.group_form_elements.details.label}>
          <GroupDescription />
        </InputGroup>
        <EmailsInput label={'*' + t.group_form_elements.emails.description} />

        <div style={{ marginTop: '1rem' }}>
          <GroupContact />
        </div>

        <div style={{ marginTop: '2rem', opacity: disabled ? '.8' : 1 }}>
          <InputGroup custom={<Location />} label={t.location.create_prompt_prefix} />
        </div>

        <FormButtons>
          <Link to="/map">
            <button className="btn-secondary" type="button" disabled={disabled}>
              {t.group_form_elements.buttons.cancel}
            </button>
          </Link>
          <button type="submit" name="submit" disabled={disabled}>
            {t.group_form_elements.buttons.submit}
          </button>
        </FormButtons>
        <p style={{ textAlign: 'center', color: 'red' }} data-testid="validation-error">
          {error}
        </p>
      </Form>
    </FormWrapper>
  )
}

export default GroupForm

const Form = styled.form`
  width: 100%;
  max-width: 30rem;
  margin: 0 auto;
  padding: 0 1rem;
  box-sizing: border-box;
  padding-bottom: 7rem;
`

const FormWrapper = styled.div`
  display: flex;
  justify-content: center;
  overflow-y: scroll;
`

const Input = <K extends 'name' | 'link_facebook'>({
  name,
  description,
  label,
  ...inputProps
}: {
  name: K
  description?: string
  label?: string
} & React.InputHTMLAttributes<HTMLInputElement>) => {
  const [value, onChange] = useFormControl<Group, K, string>(name, '')
  return (
    <InputGroup description={description} label={label}>
      <input {...inputProps} value={value} name={name} onChange={(e) => onChange(e.target.value)} />
    </InputGroup>
  )
}

const GroupDescription = () => {
  const t = useI18n(x => x.translation.components)
  const [value, onChange] = useFormControl('description', '')
  return (
    <TextareaAutosize
      placeholder={t.group_form_elements.details.placeholder}
      name="description"
      value={value}
      style={{ fontFamily: 'inherit', minHeight: '4rem' }}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}

const GroupContact = () => {
  const t = useI18n(x => x.translation.components)
  const [value, onChange] = useFormControl('contact', { phone: '', email: '' })
  return (
    <>
      <Small>{t.group_form_elements.contact_details.label}</Small>
      <div className="inputs">
        <InputGroup>
          <input
            type="email"
            name="email"
            placeholder={t.group_form_elements.contact_details.email_placeholder}
            value={value.email || ''}
            onChange={(e) => onChange({ ...value, email: e.target.value })}
          />
        </InputGroup>
        <InputGroup>
          <input
            type="tel"
            name="phone"
            placeholder={t.group_form_elements.contact_details.phone_placeholder}
            value={value.phone || ''}
            onChange={(e) => onChange({ ...value, phone: e.target.value })}
          />
        </InputGroup>
      </div>
    </>
  )
}

const FormButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 1rem 0;

  button {
    margin: 0 0.4rem;
  }
`

export function validURL(str: string) {
  var pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i'
  ) // fragment locator

  return !!pattern.test(str)
}
