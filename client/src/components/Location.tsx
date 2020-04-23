import React from 'react'
import AsyncCreatableSelect from 'react-select/async-creatable'
import { useRequest } from '../contexts/RequestProvider'
import { useI18n } from '../contexts/I18nProvider'
import { useControl } from './FormControl'

let last = ''
const debounce = (value: string) => {
  last = value
  return new Promise((res) => setTimeout(res, 300)).then(() =>
    last !== value ? Promise.reject() : value
  )
}

const Location = () => {
  const t = useI18n(locale => locale.translation.components.location)
  const request = useRequest()
  const {
    props: { value, onChange: onValue },
  } = useControl(
    'location_name',
    '',
    (x) => x.length > 0 || t.errors.none_provided
  )
  const {
    props: { onChange: onCoords },
  } = useControl('location_coord', undefined as { lat: number; lng: number } | undefined)

  return (
    <AsyncCreatableSelect
      styles={{
        placeholder: (styles) => ({ ...styles, color: 'rgba(0, 0, 0, 0.3) !important;' }),
        control: (x) => ({ ...x, borderRadius: '20px', padding: '.2rem .4rem' }),
      }}
      multi={false}
      onChange={(x: any) =>
        request<any>(`/google/placeDetails?place_id=${x.value}`).then((y) => {
          onCoords(y.geometry.location)
          onValue(x.label)
        })
      }
      placeholder={value || t.placeholder }
      loadOptions={(value) =>
        debounce(value)
          .then((val) =>
            request<{ description: string; place_id: string }[]>(
              `/google/placeSuggest?place=${val}`
            )
          )
          .then((x) => x.map((place) => ({ value: place.place_id, label: place.description })))
          .catch((err) => {
            return []
          })
      }
      backspaceRemoves={true}
      promptTextCreator={(name: string) => `${t.create_prompt_prefix} ${name}`}
    />
  )
}

export default Location
