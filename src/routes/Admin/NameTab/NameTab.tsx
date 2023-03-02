import React, { Dispatch, useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import type { User } from 'firebase/auth'
import { useUser } from 'settings/UserProvider'
import { LoginModal } from 'scenarios/Modals/LoginModal'
import { LoginCase } from 'scenarios/Modals/LoginModal/login-modal-types'
import { GridContainer, GridItem } from '@entur/grid'
import { Heading2, Paragraph } from '@entur/typography'
import { CustomURL } from './CustomURL/CustomURL'

function NameTab({
    tabIndex,
    setTabIndex,
}: {
    tabIndex: number
    setTabIndex: Dispatch<number>
}) {
    const [open, setOpen] = useState<boolean>(false)
    const user = useUser()

    const { documentId } = useParams<{ documentId: string }>()

    useEffect((): void => {
        if (tabIndex === 4 && user && user.isAnonymous) {
            setOpen(true)
        }

        if (user && !user.isAnonymous) {
            setOpen(false)
        }
    }, [user, tabIndex, setTabIndex])

    const handleDismiss = useCallback(
        (newUser: User | undefined): void => {
            if (!newUser || newUser.isAnonymous) {
                setOpen(false)
                setTabIndex(0)
            }
        },
        [setTabIndex],
    )

    if (!documentId) {
        return (
            <div>
                <Heading2>Legg til Tavla-lenke</Heading2>
                <Paragraph>
                    Vi har oppgradert tavla. Ønsker du tilgang på denne
                    funksjonaliteten må du lage en ny tavle.
                </Paragraph>
            </div>
        )
    }

    return (
        <div>
            <LoginModal
                onDismiss={handleDismiss}
                open={open}
                loginCase={LoginCase.link}
            />
            <Heading2>Lag egen Tavla-lenke</Heading2>
            <GridContainer spacing="extraLarge">
                <GridItem small={12} medium={12} large={6}>
                    <CustomURL />
                </GridItem>
            </GridContainer>
        </div>
    )
}

export { NameTab }
