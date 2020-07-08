import React, { useState } from 'react'

import LogoUpload from './LogoUpload'
import { useSettingsContext } from '../../../settings'
import SizePicker from './SizePicker'

const LogoTab = (): JSX.Element => {
    const [{ logoSize }, { setLogo, setLogoSize }] = useSettingsContext()

    return (
        <>
            <LogoUpload onChange={setLogo} />
            <SizePicker onChange={setLogoSize} value={logoSize} />
        </>
    )
}

export default LogoTab
