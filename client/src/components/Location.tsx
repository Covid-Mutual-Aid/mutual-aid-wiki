import AsyncCreatableSelect from 'react-select/async-creatable'
import React from 'react'

import { useRequest } from '../contexts/RequestProvider'
import { useFormControl } from '../state/selectors'
import { useI18n } from '../contexts/I18nProvider'

let last = ''
const debounce = (value: string) => {
  last = value
  return new Promise((res) => setTimeout(res, 300)).then(() =>
    last !== value ? Promise.reject() : value
  )
}

const Location = () => {
  const t = useI18n((locale) => locale.translation.components.location)
  const request = useRequest()
  const [locationName, onLocationName] = useFormControl('location_name', '')
  const [, onCoords] = useFormControl('location_coord')

  return (
    <AsyncCreatableSelect
      styles={{
        placeholder: (styles) => ({ ...styles, color: 'rgba(0, 0, 0, 0.3) !important;' }),
        control: (x) => ({
          ...x,
          borderRadius: '20px',
          padding: '.2rem .4rem',
          border: 'none',
          backgroundColor: 'transparent',
        }),
        menu: (x) => ({ ...x, borderRadius: '25px', padding: '.4rem' }),
        option: (x) => ({ ...x, borderRadius: '25px' }),
      }}
      multi={false}
      onChange={(x: any) =>
        request<any>(`/google/placeDetails?place_id=${x.value}`).then((y) => {
          onCoords(y.geometry.location)
          onLocationName(x.label)
        })
      }
      placeholder={locationName || t.placeholder}
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
