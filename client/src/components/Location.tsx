import React from 'react';
import AsyncCreatableSelect from 'react-select/async-creatable';
import { useRequest } from '../contexts/RequestProvider';

let last = '';
const debounce = (value: string) => {
    last = value;
    return new Promise(res => setTimeout(res, 300))
        .then(() => last !== value ? Promise.reject() : value)
}

const Location = ({ onChange, placeholder }: { onChange: (x: any) => void, placeholder: string }) => {
    const request = useRequest();

    return <AsyncCreatableSelect
        multi={false}
        onChange={(x: any) => request<any>(`/google/placeDetails?place_id=${x.value}`).then(y => onChange({ ...y.geometry.location, name: x.label }))}
        placeholder={placeholder}
        loadOptions={value => debounce(value)
            .then((val) => request<{ description: string; place_id: string }[]>(`/google/placeSuggest?place=${val}`))
            .then(x => x.map(place => {
                console.log(place)
                return ({ value: place.place_id, label: place.description })
            }))
            .catch(err => {
                console.log(err);
                return []
            })
        }
        backspaceRemoves={true}
        promptTextCreator={(name: string) => `Location: ${name}`}
    />;
}

export default Location;