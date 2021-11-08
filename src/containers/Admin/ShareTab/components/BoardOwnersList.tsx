import React, { useEffect, useState } from 'react'

import { DocumentSnapshot } from '@firebase/firestore'

import { Table, TableHead, TableRow, HeaderCell, TableBody } from '@entur/table'

import { useUser } from '../../../../auth'
import {
    getBoardOnSnapshot,
    getOwnerEmailsByUIDs,
} from '../../../../services/firebase'
import { useSettingsContext } from '../../../../settings'
import type { BoardOwnersData } from '../../../../types'
import { getDocumentId } from '../../../../utils'

import { SharedWithRows } from './SharedWithRows'

export const BoardOwnersList = (): JSX.Element => {
    const [settings, setSettings] = useSettingsContext()
    const {
        ownerRequestRecipients,
        ownerRequests,
        owners = [],
    } = settings || {}
    const user = useUser()

    const [ownersData, setOwnersData] = useState<BoardOwnersData[]>([])
    const [requestedOwnersData, setRequestedOwnersData] = useState<
        BoardOwnersData[]
    >([])

    const documentId = getDocumentId()

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

    const onRemoveOwnerFromBoard = (UIDToRemove: string): void => {
        setSettings({
            owners: owners?.filter((ownerUID) => ownerUID !== UIDToRemove),
        })
    }

    const onRemoveOwnerRequestFromBoard = (uid: string): void => {
        setSettings({
            ownerRequestRecipients: ownerRequestRecipients?.filter(
                (recipient) => recipient !== uid,
            ),
            ownerRequests: ownerRequests?.filter(
                (req) => req.recipientUID !== uid,
            ),
        })
    }

    return (
        <Table>
            <TableHead>
                <TableRow>
                    <HeaderCell>Bruker</HeaderCell>
                    <HeaderCell>Status</HeaderCell>
                    <HeaderCell>Fjern</HeaderCell>
                </TableRow>
            </TableHead>
            <TableBody>
                <SharedWithRows
                    users={ownersData}
                    currentUserUID={user?.uid ?? ''}
                    statusText="Har tilgang"
                    tooltipTextRemove="Fjern tilgang"
                    onRemove={onRemoveOwnerFromBoard}
                />
                <SharedWithRows
                    users={requestedOwnersData}
                    currentUserUID={user?.uid ?? ''}
                    statusText="Venter på svar"
                    tooltipTextRemove="Fjern forespørsel"
                    onRemove={onRemoveOwnerRequestFromBoard}
                />
            </TableBody>
        </Table>
    )
}

export default BoardOwnersList
