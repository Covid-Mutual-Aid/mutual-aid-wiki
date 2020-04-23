import React from 'react'

import { useI18nSetter } from "../contexts/I18nProvider"


const LocaleSwitcher = () => {
    const setLocale = useI18nSetter()
    return (
        <ul>
            <li><button onClick={() => setLocale("en") }>English</button></li>
            <li><button onClick={() => setLocale("es") }>Español (Castellano)</button></li>
        </ul>
    )
}

export default LocaleSwitcher
