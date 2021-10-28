import React, { useState, useEffect, Dispatch, useCallback } from 'react'

import type { User } from 'firebase/auth'

import { Heading2, Heading3, Paragraph } from '@entur/typography'
import { GridItem, GridContainer } from '@entur/grid'

import { useUser } from '../../../auth'
import { getDocumentId } from '../../../utils'
import LoginModal from '../../../components/LoginModal'

import './styles.scss'
import { useSettingsContext } from '../../../settings'
import { CheckIcon, CloseIcon, EditIcon, LinkIcon } from '@entur/icons'
import { Tooltip } from '@entur/tooltip'
import { IconButton } from '@entur/button'
import {
    DataCell,
    HeaderCell,
    Table,
    TableBody,
    TableHead,
    TableRow,
} from '@entur/table'
import { getOwnerEmails } from '../../../services/firebase'
import { BoardOwnersData } from '../../../types'

const ShareTab = ({ tabIndex, setTabIndex }: Props): JSX.Element => {
    const user = useUser()
    const [open, setOpen] = useState<boolean>(false)
    const [settings, setSettings] = useSettingsContext()
    const [titleEditMode, setTitleEditMode] = useState<boolean>(false)
    const [newBoardName, setNewBoardName] = useState<string>('Uten tittel')
    const [ownersData, setOwnersData] = useState<BoardOwnersData[]>([])

    const documentId = getDocumentId()
    const { boardName, ownerRequestRecipients, ownerRequests, owners } =
        settings || {}

    useEffect((): void => {
        if (tabIndex === 5 && user && user.isAnonymous) {
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

    const onChangeTitle = () => {
        setTitleEditMode(false)
        if (newBoardName === boardName) return
        setSettings({ boardName: newBoardName })
    }

    useEffect(() => {
        if (owners)
            getOwnerEmails(owners)
                .then((data) => setOwnersData(data))
                .catch(() =>
                    setOwnersData([
                        {
                            uid: 'Could not fetch',
                            email: 'could not fetch',
                        },
                    ]),
                )
    }, [owners])

    const onRemoveOwnerFromBoard = (uid: string): void => {
        setSettings({
            owners: owners?.filter((ownerEntry) => ownerEntry !== uid),
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
        <Heading3 className="share-page__title" margin="none" as="span">
            {boardName}
            <Tooltip placement="bottom" content="Endre navn">
                <IconButton
                    onClick={() => setTitleEditMode(true)}
                    className="share-page__title__button"
                >
                    <EditIcon />
                </IconButton>
            </Tooltip>
        </Heading3>
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
            <LoginModal
                onDismiss={handleDismiss}
                open={open}
                loginCase="share"
            />
            <Heading2>Del din tavle med andre</Heading2>
            <GridContainer spacing="extraLarge" className="share-grid">
                <GridItem small={12} medium={12} large={6}>
                    <Paragraph>
                        Denne siden lar deg dele den låste tavlen din med andre
                        slik at de også kan redigere og endre på
                        {String.fromCharCode(160)}den.
                    </Paragraph>
                    {boardTitleElement}
                    <div className="share-page__text">
                        <LinkIcon className="share-page__text__icon" />
                        <span className="share-page__text__description">
                            {`${window.location.host}/t/${getDocumentId()}`}
                        </span>
                    </div>
                </GridItem>
                <GridItem small={12} medium={12} large={6}>
                    <Heading3>Personer med tilgang</Heading3>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <HeaderCell>Bruker</HeaderCell>
                                <HeaderCell>Status</HeaderCell>
                                <HeaderCell>Fjern</HeaderCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {ownersData.map((owner) => {
                                return (
                                    <TableRow>
                                        <DataCell>{owner.email}</DataCell>
                                        <DataCell>Har tilgang</DataCell>
                                        <DataCell>
                                            <Tooltip
                                                placement="bottom"
                                                content="Fjern tilgang"
                                            >
                                                <IconButton
                                                    onClick={() =>
                                                        onRemoveOwnerFromBoard(
                                                            owner.uid,
                                                        )
                                                    }
                                                    className="share-page__title__button"
                                                >
                                                    <CloseIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </DataCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </GridItem>
            </GridContainer>
        </div>
    )
}

interface Props {
    tabIndex: number
    setTabIndex: Dispatch<number>
}

export default ShareTab
