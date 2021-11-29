import React, { useState, useEffect, Dispatch } from 'react'

import type { User } from 'firebase/auth'

import { Heading2, Paragraph } from '@entur/typography'
import { GridItem, GridContainer } from '@entur/grid'

import { useUser } from '../../../auth'
import { getDocumentId } from '../../../utils'
import LoginModal from '../../../components/Modals/LoginModal'

import './styles.scss'
import CustomURL from './CustomURL'

const NameTab = ({ tabIndex, setTabIndex }: Props): JSX.Element => {
    const [open, setOpen] = useState<boolean>(false)
    const user = useUser()

    const documentId = getDocumentId()

    useEffect((): void => {
        if (tabIndex === 4 && user && user.isAnonymous) {
            setOpen(true)
        }

        if (user && !user.isAnonymous) {
            setOpen(false)
        }
    }, [user, tabIndex, setTabIndex])

    const handleDismiss = (newUser: User | undefined): void => {
        if (!newUser || newUser.isAnonymous) {
            setOpen(false)
            setTabIndex(0)
        }
    }

    if (!documentId) {
        return (
            <div className="name-page">
                <Heading2 className="heading">Legg til Tavla-lenke</Heading2>
                <Paragraph className="name-page__paragraph">
                    Vi har oppgradert tavla. Ønsker du tilgang på denne
                    funksjonaliteten må du lage en ny tavle.
                </Paragraph>
            </div>
        )
    }

    return (
        <div className="name-page">
            <LoginModal
                onDismiss={handleDismiss}
                open={open}
                loginCase="link"
            />
            <Heading2 className="heading">Lag egen Tavla-lenke</Heading2>
            <GridContainer spacing="extraLarge" className="name-grid">
                <GridItem small={12} medium={12} large={6}>
                    <CustomURL />
                </GridItem>
            </GridContainer>
        </div>
    )
}

interface Props {
    tabIndex: number
    setTabIndex: Dispatch<number>
}

export default NameTab
