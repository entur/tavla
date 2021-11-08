import React, { useState, useEffect, Dispatch } from 'react'

import type { User } from 'firebase/auth'

import { DocumentSnapshot } from 'firebase/firestore'

import { Heading2, Heading3, Paragraph } from '@entur/typography'
import { GridItem, GridContainer } from '@entur/grid'
import { NegativeButton } from '@entur/button'

import { useUser } from '../../../auth'
import { getDocumentId } from '../../../utils'
import { useSettingsContext } from '../../../settings'
import {
    getBoardOnSnapshot,
    getOwnerEmailsByUIDs,
} from '../../../services/firebase'
import { BoardOwnersData, OwnerRequest } from '../../../types'

import LoginModal from '../../../components/Modals/LoginModal'
import RemoveSelfFromTavleModal from '../../../components/Modals/RemoveSelfFromTavleModal'
import NeedToBeOwnerModal from '../../../components/Modals/NeedToBeOwnerModal'

import EditableBoardTitle from './components/EditableBoardTitle'
import BoardLink from './components/BoardLink'
import AddNewOwnersInput from './components/AddNewOwnersInput'
import BoardOwnersList from './components/BoardOwnersList'

import './styles.scss'

const ShareTab = ({ tabIndex, setTabIndex }: Props): JSX.Element => {
    const [settings] = useSettingsContext()
    const { owners = [] } = settings || {}
    const user = useUser()

    const [loginModalOpen, setLoginModalOpen] = useState<boolean>(false)
    const [needToBeOwnerModalOpen, setNeedToBeOwnerModalOpen] =
        useState<boolean>(false)
    const [removeSelfModalOpen, setRemoveSelfModalOpen] = useState(false)

    const [ownersData, setOwnersData] = useState<BoardOwnersData[]>([])
    const [requestedOwnersData, setRequestedOwnersData] = useState<
        BoardOwnersData[]
    >([])
    const [ownerRequests, setOwnerRequests] = useState<OwnerRequest[]>([])

    const documentId = getDocumentId()

    const handleDismissLoginModal = (newUser: User | undefined): void => {
        if (!newUser || newUser.isAnonymous) {
            setLoginModalOpen(false)
            setTabIndex(0)
        }
    }

    const handleDismissNeedToBeOwnerModal = (goToFirstTab = false): void => {
        setNeedToBeOwnerModalOpen(false)
        if (goToFirstTab) setTabIndex(0)
    }

    useEffect((): void => {
        if (tabIndex === 5 && user && user.isAnonymous) {
            setLoginModalOpen(true)
        }

        if (user && !user.isAnonymous) {
            if (tabIndex === 5 && !owners.includes(user.uid)) {
                setNeedToBeOwnerModalOpen(true)
            } else {
                setLoginModalOpen(false)
                setNeedToBeOwnerModalOpen(false)
            }
        }
    }, [user, owners, tabIndex, setTabIndex])

    useEffect(() => {
        const unsubscribeBoard = getBoardOnSnapshot(documentId, {
            next: (documentSnapshot: DocumentSnapshot) => {
                if (!documentSnapshot.exists) return
                if (documentSnapshot.metadata.hasPendingWrites) return
                getOwnerEmailsByUIDs(documentSnapshot.data()?.owners).then(
                    (data) => setOwnersData(data),
                )
                getOwnerEmailsByUIDs(
                    documentSnapshot.data()?.ownerRequestRecipients,
                ).then((data) => setRequestedOwnersData(data))
                setOwnerRequests(documentSnapshot.data()?.ownerRequests)
            },
            error: () => {
                setOwnersData([])
                setRequestedOwnersData([])
            },
        })

        return () => unsubscribeBoard()
    }, [documentId])

    if (!documentId) {
        return (
            <div className="share-page">
                <Heading2 className="heading">Del din tavle med andre</Heading2>
                <Paragraph className="share-page__paragraph">
                    Vi har oppgradert tavla. Ønsker du tilgang på denne
                    funksjonaliteten må du lage en ny tavle.
                </Paragraph>
            </div>
        )
    }

    return (
        <div className="share-page">
            <Heading2 className="heading">Del din tavle med andre</Heading2>
            <Paragraph>
                Denne siden lar deg dele den låste tavlen din med andre, slik at
                dere kan samarbeide på
                {String.fromCharCode(160)}den.
            </Paragraph>
            <GridContainer spacing="extraLarge" className="share-grid">
                <GridItem
                    small={12}
                    medium={12}
                    large={6}
                    style={{ marginBottom: '1rem' }}
                >
                    <EditableBoardTitle />
                    <BoardLink boardID={documentId} />
                    {owners?.length > 1 && (
                        <NegativeButton
                            onClick={() => {
                                setRemoveSelfModalOpen(true)
                            }}
                            width="auto"
                            size="medium"
                        >
                            Fjern meg fra tavlen
                        </NegativeButton>
                    )}
                </GridItem>
                <GridItem small={12} medium={12} large={6}>
                    <Heading3>Legg til eier av tavlen</Heading3>
                    <AddNewOwnersInput
                        ownersData={ownersData}
                        requestedOwnersData={requestedOwnersData}
                    />
                    <Heading3>Personer med tilgang</Heading3>
                    <BoardOwnersList
                        documentId={documentId}
                        ownersData={ownersData}
                        requestedOwnersData={requestedOwnersData}
                        ownerRequests={ownerRequests}
                    />
                </GridItem>
            </GridContainer>

            <RemoveSelfFromTavleModal
                open={removeSelfModalOpen}
                onDismiss={() => setRemoveSelfModalOpen(false)}
                id={documentId}
                uid={user?.uid ?? ''}
                settingsContextAvailable={true}
            />
            <LoginModal
                onDismiss={handleDismissLoginModal}
                open={loginModalOpen}
                loginCase="share"
            />
            <NeedToBeOwnerModal
                open={needToBeOwnerModalOpen}
                onDismiss={handleDismissNeedToBeOwnerModal}
                uid={user?.uid}
            />
        </div>
    )
}

interface Props {
    tabIndex: number
    setTabIndex: Dispatch<number>
}

export default ShareTab
