import React, { Dispatch, useEffect, useState } from 'react'
import type { User } from 'firebase/auth'
import type { DocumentData, DocumentSnapshot } from 'firebase/firestore'
import type { FirebaseError } from 'firebase/app'
import { Heading2, Heading3, Paragraph } from '@entur/typography'
import { GridContainer, GridItem } from '@entur/grid'
import { NegativeButton } from '@entur/button'
import { useSettings } from '../../../settings/SettingsProvider'
import { useUser } from '../../../UserProvider'
import { getDocumentId } from '../../../utils'
import {
    getBoardOnSnapshot,
    getInvitesForBoardOnSnapshot,
    getOwnersDataByBoardIdAsOwner,
} from '../../../services/firebase'
import { BoardOwnersData, Invite } from '../../../types'
import { LoginModal } from '../../../components/LoginModal/LoginModal'
import { LoginCase } from '../../../components/LoginModal/login-modal-types'
import { RemoveSelfFromTavleModal } from '../../../components/Modals/RemoveSelfFromTavleModal'
import { NeedToBeOwnerModal } from '../../../components/Modals/NeedToBeOwnerModal'
import { EditableBoardTitle } from './components/EditableBoardTitle'
import { BoardLink } from './components/BoardLink'
import { AddNewOwnersInput } from './components/AddNewOwnersInput'
import { BoardOwnersList } from './components/BoardOwnersList'
import './ShareTab.scss'

const ShareTab = ({ tabIndex, setTabIndex, locked }: Props): JSX.Element => {
    const user = useUser()
    const [settings] = useSettings()

    const [loginModalOpen, setLoginModalOpen] = useState<boolean>(false)
    const [needToBeOwnerModalOpen, setNeedToBeOwnerModalOpen] =
        useState<boolean>(false)
    const [removeSelfModalOpen, setRemoveSelfModalOpen] = useState(false)

    const [ownersData, setOwnersData] = useState<BoardOwnersData[]>([])
    const [boardName, setboardName] = useState<string>('')

    const [invites, setInvites] = useState<Invite[]>([])

    const [shouldRefresh, setShouldRefresh] = useState<boolean>(false)

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

    useEffect(() => {
        if (tabIndex === 5 && user && user.isAnonymous) {
            setLoginModalOpen(true)
        }

        if (user && !user.isAnonymous) {
            if (
                tabIndex === 5 &&
                !settings?.owners?.some((ownerUID) => ownerUID === user.uid)
            ) {
                setNeedToBeOwnerModalOpen(true)
            } else {
                setLoginModalOpen(false)
                setNeedToBeOwnerModalOpen(false)
            }
        }
    }, [user, settings?.owners, tabIndex, setTabIndex])

    useEffect(() => {
        if (shouldRefresh) window.location.reload()
        setShouldRefresh(false)
    }, [shouldRefresh])

    useEffect(() => {
        if (locked) return
        const unsubscribeBoard = getBoardOnSnapshot(documentId, {
            next: (documentSnapshot: DocumentSnapshot) => {
                if (!documentSnapshot.exists) return
                if (documentSnapshot.metadata.hasPendingWrites) return

                setboardName(documentSnapshot.data()?.boardName)
                getOwnersDataByBoardIdAsOwner(documentSnapshot.id)
                    .then((ownersDataResponse: BoardOwnersData[]) =>
                        setOwnersData(ownersDataResponse),
                    )
                    .catch((error: Error) => {
                        if (
                            error.name === 'FirebaseError' &&
                            (error as FirebaseError).code ===
                                'functions/permission-denied'
                        )
                            setShouldRefresh(true)
                    })
            },
            error: () => {
                setOwnersData([])
            },
        })

        const unsubscribeInvites = getInvitesForBoardOnSnapshot(documentId, {
            next: (querySnapshot) => {
                if (querySnapshot.metadata.hasPendingWrites) return
                const updatedInvites = querySnapshot.docs.map(
                    (docSnapshot: DocumentData) =>
                        ({
                            receiver: docSnapshot.data().receiver,
                            sender: docSnapshot.data().sender,
                            timeIssued: docSnapshot.data().timeIssued,
                        } as Invite),
                )
                setInvites(updatedInvites)
            },
            error: () => setInvites([]),
        })

        return () => {
            unsubscribeBoard()
            unsubscribeInvites()
        }
    }, [documentId, locked])

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
            <Heading2 className="heading">Del tavla med andre</Heading2>
            <Paragraph>
                Denne siden lar deg dele den låste tavla di med andre, slik at
                dere kan samarbeide på&nbsp;den.
            </Paragraph>
            <GridContainer spacing="extraLarge" className="share-grid">
                <GridItem
                    small={12}
                    medium={12}
                    large={6}
                    style={{ marginBottom: '1rem' }}
                >
                    <EditableBoardTitle
                        documentId={documentId}
                        boardName={boardName}
                    />
                    <BoardLink boardID={documentId} />
                    {ownersData.length > 1 && (
                        <NegativeButton
                            onClick={() => {
                                setRemoveSelfModalOpen(true)
                            }}
                            width="auto"
                            size="medium"
                        >
                            Fjern meg fra tavla
                        </NegativeButton>
                    )}
                </GridItem>
                <GridItem small={12} medium={12} large={6}>
                    <Heading3>Legg til eier av tavla</Heading3>
                    <AddNewOwnersInput
                        documentId={documentId}
                        ownersData={ownersData}
                        invites={invites}
                    />
                    <Heading3>Andre personer med tilgang</Heading3>
                    <BoardOwnersList
                        documentId={documentId}
                        ownersData={ownersData}
                        invites={invites}
                    />
                </GridItem>
            </GridContainer>

            <RemoveSelfFromTavleModal
                open={removeSelfModalOpen}
                onDismiss={() => setRemoveSelfModalOpen(false)}
                id={documentId}
                uid={user?.uid ?? ''}
                forceRefresh={true}
            />
            <LoginModal
                onDismiss={handleDismissLoginModal}
                open={loginModalOpen}
                loginCase={LoginCase.share}
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
    locked: boolean
}

export { ShareTab }
