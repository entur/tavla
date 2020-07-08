import React, { useState, useEffect } from 'react'
import { Heading2, Paragraph } from '@entur/typography'
import LoginModal from '../LoginModal'
import { useFirebaseAuthentication } from '../../../auth'
import { User } from 'firebase/app'

const LogoTab = ({ tabIndex, setTabIndex }: Props): JSX.Element => {
    const [open, setOpen] = useState<boolean>(false)
    const user = useFirebaseAuthentication()
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>()

    useEffect((): void => {
        if (tabIndex === 1 && user && user.isAnonymous) {
            setOpen(true)
        }

        if (user && !user.isAnonymous) {
            setOpen(false)
        }
    }, [user, tabIndex, setTabIndex])

    const handle = (newUser: User): void => {
        if (!(newUser && !newUser.isAnonymous)) {
            setOpen(false)
            setTabIndex()
        }
    }

    return (
        <div>
            <LoginModal onDismiss={handle} open={open} />
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
