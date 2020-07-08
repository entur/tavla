import React, { useState, useEffect } from 'react'
import { Heading2 } from '@entur/typography'
import LoginModal from '../LoginModal'
import { useFirebaseAuthentication } from '../../../auth'
import { useSettingsContext } from '../../../settings'
import LogoUpload from './LogoUpload'
import SizePicker from './SizePicker'

const LogoTab = ({ tabIndex, setTabIndex }: Props): JSX.Element => {
    const [open, setOpen] = useState<boolean>(false)
    const user = useFirebaseAuthentication()

    useEffect((): void => {
        if (tabIndex === 1 && user && user.isAnonymous) {
            setOpen(true)
        }

        if (user && !user.isAnonymous) {
            setOpen(false)
        }
    }, [user, tabIndex])

    const handleModal = (): void => {
        setOpen(false)
        if (!(user && !user.isAnonymous)) {
            setTabIndex()
        }
    }

    const [{ logoSize }, { setLogo, setLogoSize }] = useSettingsContext()

    return (
        <>
            <LoginModal onDismiss={handleModal} open={open} />
            <Heading2>Last opp logo</Heading2>
            <LogoUpload onChange={setLogo} />
            <SizePicker onChange={setLogoSize} value={logoSize} />
        </>
    )
}

interface Props {
    tabIndex: number
    setTabIndex: () => void
}

export default LogoTab
