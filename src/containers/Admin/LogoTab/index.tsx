import React, { useState, useEffect } from 'react'
import { Heading2, Paragraph } from '@entur/typography'
import LoginModal from '../LoginModal'
import { useFirebaseAuthentication } from '../../../auth'
import { User } from 'firebase/app'
import { getDocumentId } from '../../../utils'

const LogoTab = ({ tabIndex, setTabIndex }: Props): JSX.Element => {
    const [open, setOpen] = useState<boolean>(false)
    const user = useFirebaseAuthentication()
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>()

    const documentId = getDocumentId()

    useEffect((): void => {
        if (tabIndex === 2 && user && user.isAnonymous) {
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

    if (!documentId) {
        return (
            <div>
                <Heading2>Last opp logo</Heading2>
                <Paragraph>
                    Vi har oppgradert tavla. Ønsker du tilgang på denne
                    funksjonaliteten må du lage en ny tavle.
                </Paragraph>
            </div>
        )
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
