import React, { useState } from 'react'

import LogoUpload from './LogoUpload'
import { useSettingsContext } from '../../../settings'

const LogoTab = (): JSX.Element => {
    const [, { setLogo }] = useSettingsContext()

    const handleChange = (url: string): void => {
        setLogo(url)
    }

    return <LogoUpload onChange={handleChange} />
}

export default LogoTab
