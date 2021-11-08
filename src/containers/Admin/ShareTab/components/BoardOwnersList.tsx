import React, { useEffect, useState } from 'react'

import { Table, TableHead, TableRow, HeaderCell, TableBody } from '@entur/table'

import { useUser } from '../../../../auth'

import { useSettingsContext } from '../../../../settings'
import type { BoardOwnersData, OwnerRequest } from '../../../../types'

import { SharedWithRows } from './SharedWithRows'
import { updateSingleSettingsField } from '../../../../services/firebase'

export const BoardOwnersList = ({
    documentId,
    ownersData,
    requestedOwnersData,
    ownerRequests,
}: Props): JSX.Element => {
    const setSettings = useSettingsContext()[1]
    const user = useUser()

    const owners: string[] = ownersData.map(
        (owner: BoardOwnersData) => owner.uid,
    )
    const ownerRequestRecipients: string[] = requestedOwnersData.map(
        (reqestedOwner: BoardOwnersData) => reqestedOwner.uid,
    )

    const onRemoveOwnerFromBoard = (UIDToRemove: string): void => {
        updateSingleSettingsField(
            documentId,
            'owners',
            owners.filter((ownerUID) => ownerUID !== UIDToRemove),
        )
    }

    const onRemoveOwnerRequestFromBoard = (uid: string): void => {
        updateSingleSettingsField(
            documentId,
            'ownerRequestRecipients',
            ownerRequestRecipients.filter((recipient) => recipient !== uid),
        )
        updateSingleSettingsField(
            documentId,
            'ownerRequests',
            ownerRequests.filter((req) => req.recipientUID !== uid),
        )
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

interface Props {
    documentId: string
    ownersData: BoardOwnersData[]
    requestedOwnersData: BoardOwnersData[]
    ownerRequests: OwnerRequest[]
}

export default BoardOwnersList
