import React, { useState, useEffect, Dispatch } from 'react'

import type { DocumentSnapshot } from 'firebase/firestore'
import type { User } from 'firebase/auth'

import copy from 'copy-to-clipboard'

import { Heading2, Heading3, Paragraph } from '@entur/typography'
import { GridItem, GridContainer } from '@entur/grid'
import { AddIcon, CheckIcon, CloseIcon, EditIcon, LinkIcon } from '@entur/icons'
import { Tooltip } from '@entur/tooltip'
import {
    IconButton,
    NegativeButton,
    SecondarySquareButton,
} from '@entur/button'
import { TextField } from '@entur/form'
import {
    DataCell,
    HeaderCell,
    Table,
    TableBody,
    TableHead,
    TableRow,
} from '@entur/table'
import { useToast } from '@entur/alert'

import { useUser } from '../../../auth'
import { getDocumentId } from '../../../utils'
import { useSettingsContext } from '../../../settings'
import LoginModal from '../../../components/Modals/LoginModal'
import RemoveSelfFromTavleModal from '../../../components/Modals/RemoveSelfFromTavleModal'
import NeedToBeOwnerModal from '../../../components/Modals/NeedToBeOwnerModal'
import {
    getBoardOnSnapshot,
    getOwnerEmailsByUIDs,
    getOwnerUIDByEmail,
} from '../../../services/firebase'

import type { BoardOwnersData } from '../../../types'

import './styles.scss'

enum inputFeedback {
    NOT_VALID_EMAIL = 'Ugyldig: Du har ikke skrevet en gylig e-postadresse.',
    EMAIL_UNAVAILABLE = 'Ikke funnet: Ingen bruker med denne e-postadressen ble funnet.',
    AlREADY_ADDED = 'Denne brukeren er allerede lagt til.',
    REQUEST_SENT = 'Forespørel om eierskap i tavla ble sendt!',
    NOTHING = '',
}

enum inputFeedbackType {
    SUCCESS = 'success',
    FAILURE = 'error',
    CLEAR = 'info',
}

const ShareTab = ({ tabIndex, setTabIndex }: Props): JSX.Element => {
    const user = useUser()
    const [loginModalOpen, setLoginModalOpen] = useState<boolean>(false)
    const [needToBeOwnerModalOpen, setNeedToBeOwnerModalOpen] =
        useState<boolean>(false)
    const [settings, setSettings] = useSettingsContext()
    const [titleEditMode, setTitleEditMode] = useState<boolean>(false)
    const [newBoardName, setNewBoardName] = useState<string>('Uten tittel')
    const [newOwnerInput, setNewOwnerInput] = useState<string>('')
    const [inputFeedbackMessage, setInputFeedbackMessage] = useState(
        inputFeedback.NOTHING,
    )
    const [inputFeedbackMessageType, setInputFeedbackMessageType] = useState(
        inputFeedbackType.CLEAR,
    )
    const [ownersData, setOwnersData] = useState<BoardOwnersData[]>([])
    const [requestedOwnersData, setRequestedOwnersData] = useState<
        BoardOwnersData[]
    >([])
    const [removeSelfModalOpen, setRemoveSelfModalOpen] = useState(false)

    const { addToast } = useToast()

    const documentId = getDocumentId()
    const {
        boardName,
        ownerRequestRecipients,
        ownerRequests,
        owners = [],
    } = settings || {}

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
        const unsubscribeOwners = getBoardOnSnapshot(documentId, {
            next: (documentSnapshot: DocumentSnapshot) => {
                if (!documentSnapshot.exists) return
                if (documentSnapshot.metadata.hasPendingWrites) return
                getOwnerEmailsByUIDs(documentSnapshot.data()?.owners).then(
                    (data) => setOwnersData(data),
                )
            },
            error: () => setOwnersData([{ uid: '', email: '' }]),
        })

        const unsubscribeRequests = getBoardOnSnapshot(documentId, {
            next: (documentSnapshot: DocumentSnapshot) => {
                if (!documentSnapshot.exists) return
                if (documentSnapshot.metadata.hasPendingWrites) return
                getOwnerEmailsByUIDs(
                    documentSnapshot.data()?.ownerRequestRecipients,
                ).then((data) => setRequestedOwnersData(data))
            },
            error: () => setRequestedOwnersData([{ uid: '', email: '' }]),
        })

        return () => {
            unsubscribeOwners()
            unsubscribeRequests()
        }
    }, [documentId])

    const onChangeTitle = () => {
        setTitleEditMode(false)
        if (newBoardName === boardName) return
        setSettings({ boardName: newBoardName })
    }

    const EMAIL_REGEX =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    const onAddOwnerRequestToBoard = async () => {
        if (!newOwnerInput.match(EMAIL_REGEX)) {
            setInputFeedbackMessageType(inputFeedbackType.FAILURE)
            setInputFeedbackMessage(inputFeedback.NOT_VALID_EMAIL)
            return
        }
        const uidResponse = await getOwnerUIDByEmail(newOwnerInput)
        if (typeof uidResponse === 'string') {
            setInputFeedbackMessageType(inputFeedbackType.FAILURE)
            setInputFeedbackMessage(inputFeedback.EMAIL_UNAVAILABLE)
        } else {
            if (
                settings?.ownerRequestRecipients.includes(uidResponse.uid) ||
                settings?.owners?.includes(uidResponse.uid)
            ) {
                setInputFeedbackMessageType(inputFeedbackType.FAILURE)
                setInputFeedbackMessage(inputFeedback.AlREADY_ADDED)
            } else if (user && settings) {
                setSettings({
                    ownerRequestRecipients: [
                        ...settings?.ownerRequestRecipients,
                        uidResponse.uid,
                    ],
                    ownerRequests: [
                        {
                            recipientUID: uidResponse.uid,
                            requestIssuerUID: user.uid,
                        },
                    ],
                })
                setInputFeedbackMessageType(inputFeedbackType.SUCCESS)
                setInputFeedbackMessage(inputFeedback.REQUEST_SENT)
                setNewOwnerInput('')
            }
        }
    }

    const onRemoveOwnerFromBoard = (UIDToRemove: string): void => {
        setSettings({
            owners: owners?.filter((ownerUID) => ownerUID !== UIDToRemove),
        })
    }

    const onRemoveOwnerRequestFromBoard = (uid: string): void => {
        if (ownerRequestRecipients && ownerRequests)
            setSettings({
                ownerRequestRecipients: ownerRequestRecipients.filter(
                    (recipient) => recipient !== uid,
                ),
                ownerRequests: ownerRequests.filter(
                    (req) => req.recipientUID !== uid,
                ),
            })
    }

    const boardTitleElement = titleEditMode ? (
        <span className="share-page__title">
            <input
                className="share-page__title--input"
                defaultValue={boardName}
                autoFocus={true}
                onChange={(e) => setNewBoardName(e.currentTarget.value)}
                onKeyUp={(e): void => {
                    if (e.key === 'Enter') onChangeTitle()
                }}
            />
            <Tooltip placement="bottom" content="Lagre navn">
                <IconButton
                    onClick={onChangeTitle}
                    className="share-page__title__button"
                >
                    <CheckIcon />
                </IconButton>
            </Tooltip>
            <Tooltip placement="bottom" content="Avbryt">
                <IconButton
                    onClick={() => setTitleEditMode(false)}
                    className="share-page__title__button"
                >
                    <CloseIcon />
                </IconButton>
            </Tooltip>
        </span>
    ) : (
        <Heading2 className="share-page__title" margin="none" as="span">
            {boardName}
            <Tooltip placement="bottom" content="Endre navn">
                <IconButton
                    onClick={() => setTitleEditMode(true)}
                    className="share-page__title__button"
                >
                    <EditIcon size={20} />
                </IconButton>
            </Tooltip>
        </Heading2>
    )

    const BoardLink: JSX.Element = (
        <div className="share-page__link">
            <Tooltip placement="bottom-right" content="Kopier lenke">
                <IconButton
                    onClick={() => {
                        copy(`${window.location.host}/t/${documentId}`)
                        addToast({
                            title: 'Kopiert',
                            content:
                                'Linken har nå blitt kopiert til din utklippstavle.',
                            variant: 'success',
                        })
                    }}
                    style={{ marginLeft: '-8px' }}
                >
                    <LinkIcon className="share-page__link__icon" />
                    <span className="share-page__link__description">
                        {`${window.location.host}/t/${documentId}`}
                    </span>
                </IconButton>
            </Tooltip>
        </div>
    )

    const AddNewOwnersInput: JSX.Element = (
        <div className="share-page__input-area">
            <div className="share-page__input-area__input-field">
                <TextField
                    label="E-postadressen til brukeren"
                    value={newOwnerInput}
                    onChange={(e) => {
                        setNewOwnerInput(e.currentTarget.value)
                        setInputFeedbackMessageType(inputFeedbackType.CLEAR)
                        setInputFeedbackMessage(inputFeedback.NOTHING)
                    }}
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                        if (e.key === 'Enter') onAddOwnerRequestToBoard()
                    }}
                    onBlur={() => {
                        setInputFeedbackMessageType(inputFeedbackType.CLEAR)
                        setInputFeedbackMessage(inputFeedback.NOTHING)
                    }}
                    maxLength={80}
                    variant={inputFeedbackMessageType}
                    feedback={inputFeedbackMessage}
                />
            </div>
            <div className="share-page__input-area__submit-button">
                <Tooltip content="Legg til eier" placement="top">
                    <SecondarySquareButton
                        onClick={onAddOwnerRequestToBoard}
                        aria-label="Legg til eier av tavla"
                    >
                        <AddIcon />
                    </SecondarySquareButton>
                </Tooltip>
            </div>
        </div>
    )

    const OwnersWithAccessRows: JSX.Element[] = ownersData
        .filter((owner) => owner.uid != user?.uid)
        .map((owner) => (
            <TableRow key={owner.uid}>
                <DataCell>{owner.email}</DataCell>
                <DataCell>Har tilgang</DataCell>
                <DataCell>
                    <Tooltip placement="bottom" content="Fjern tilgang">
                        <IconButton
                            onClick={() => onRemoveOwnerFromBoard(owner.uid)}
                            className="share-page__title__button"
                        >
                            <CloseIcon />
                        </IconButton>
                    </Tooltip>
                </DataCell>
            </TableRow>
        ))

    const OwnersRequestedForAccessRows: JSX.Element[] = requestedOwnersData.map(
        (requestedOwner) => (
            <TableRow key={requestedOwner.uid}>
                <DataCell>{requestedOwner.email}</DataCell>
                <DataCell>Venter på svar</DataCell>
                <DataCell>
                    <Tooltip placement="bottom" content="Fjern forespørsel">
                        <IconButton
                            onClick={() =>
                                onRemoveOwnerRequestFromBoard(
                                    requestedOwner.uid,
                                )
                            }
                            className="share-page__title__button"
                        >
                            <CloseIcon />
                        </IconButton>
                    </Tooltip>
                </DataCell>
            </TableRow>
        ),
    )

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
                <GridItem small={12} medium={12} large={6}>
                    {boardTitleElement}
                    {BoardLink}
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
                    {AddNewOwnersInput}
                    <Heading3>Personer med tilgang</Heading3>

                    <Table>
                        <TableHead>
                            <TableRow>
                                <HeaderCell>Bruker</HeaderCell>
                                <HeaderCell>Status</HeaderCell>
                                <HeaderCell>Fjern</HeaderCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>{OwnersWithAccessRows}</TableBody>
                        <TableBody>{OwnersRequestedForAccessRows}</TableBody>
                    </Table>
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
