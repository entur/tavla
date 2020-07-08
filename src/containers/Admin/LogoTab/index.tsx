import React, { useState, useEffect } from 'react'
import { Heading2, Paragraph } from '@entur/typography'
import LoginModal from '../LoginModal'
import { useFirebaseAuthentication } from '../../../auth'

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

    const handleModal = () => {
        setOpen(false)
        if (!(user && !user.isAnonymous)) {
            setTabIndex()
        }
    }

    return (
        <div>
            <LoginModal onDismiss={() => handleModal()} open={open} />
            <Heading2>Last opp logo</Heading2>
            <Paragraph>
                Snart kommer det mulighet for å laste opp egen logo på tavla.
            </Paragraph>
        </div>
    )
}

interface Props {
    tabIndex: number
    setTabIndex: () => void
}

export default LogoTab
