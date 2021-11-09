import React from 'react'

import { Table, TableHead, TableRow, HeaderCell, TableBody } from '@entur/table'

import { useUser } from '../../../../auth'

import type { BoardOwnersData, OwnerRequest } from '../../../../types'

import { updateSingleSettingsField } from '../../../../services/firebase'

import { SharedWithRows } from './SharedWithRows'

export const BoardOwnersList = ({
    documentId,
    ownersData,
    requestedOwnersData,
    ownerRequests,
}: Props): JSX.Element => {
    const user = useUser()

    const owners: string[] = ownersData.map(
        (owner: BoardOwnersData) => owner.uid,
    )
    const ownerRequestRecipients: string[] = requestedOwnersData.map(
        (reqestedOwner: BoardOwnersData) => reqestedOwner.uid,
    )

    const onRemoveOwnerFromBoard = async (
        UIDToRemove: string,
    ): Promise<void> => {
        try {
            await updateSingleSettingsField(
                documentId,
                'owners',
                owners.filter((ownerUID) => ownerUID !== UIDToRemove),
            )
        } catch {
            throw new Error('Write error: could not remove owner from board.')
        }
    }

    const onRemoveOwnerRequestFromBoard = async (
        UIDToRemove: string,
    ): Promise<void> => {
        try {
            await updateSingleSettingsField(
                documentId,
                'ownerRequestRecipients',
                ownerRequestRecipients.filter(
                    (recipient) => recipient !== UIDToRemove,
                ),
            )
            await updateSingleSettingsField(
                documentId,
                'ownerRequests',
                ownerRequests.filter((req) => req.recipientUID !== UIDToRemove),
            )
        } catch {
            throw new Error('Write error: could not remove request from board.')
        }
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
