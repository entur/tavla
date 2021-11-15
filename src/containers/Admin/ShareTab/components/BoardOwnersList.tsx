import React from 'react'

import { Table, TableHead, TableRow, HeaderCell, TableBody } from '@entur/table'

import { useUser } from '../../../../auth'

import type { BoardOwnersData, Invite } from '../../../../types'

import {
    removeBoardInvite,
    updateSingleSettingsField,
} from '../../../../services/firebase'

import { SharedWithRows } from './SharedWithRows'

export const BoardOwnersList = ({
    documentId,
    ownersData,
    invites,
}: Props): JSX.Element => {
    const user = useUser()

    const ownersDataFiltered = ownersData.filter(
        (owner) => owner.uid !== user?.uid,
    )
    const invitesMapped = invites.map((invite) => ({
        uid: '',
        email: invite.reciever,
    }))

    const onRemoveOwnerFromBoard = async (
        userToRemove: BoardOwnersData,
    ): Promise<void> => {
        try {
            const owners: string[] = ownersData.map(
                (owner: BoardOwnersData) => owner.email,
            )
            await updateSingleSettingsField(
                documentId,
                'owners',
                owners.filter((ownerUID) => ownerUID !== userToRemove.uid),
            )
        } catch {
            throw new Error('Write error: could not remove owner from board.')
        }
    }

    const onRemoveInviteFromBoard = async (
        userToRemove: BoardOwnersData,
    ): Promise<void> => {
        try {
            await removeBoardInvite(documentId, userToRemove.email)
        } catch {
            throw new Error('Write error: could not remove invite from board.')
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
                    users={ownersDataFiltered}
                    currentUserEmail={user?.uid ?? ''}
                    statusText="Har tilgang"
                    tooltipTextRemove="Fjern tilgang"
                    onRemove={onRemoveOwnerFromBoard}
                />
                <SharedWithRows
                    users={invitesMapped}
                    currentUserEmail={user?.uid ?? ''}
                    statusText="Venter på svar"
                    tooltipTextRemove="Fjern forespørsel"
                    onRemove={onRemoveInviteFromBoard}
                />
            </TableBody>
        </Table>
    )
}

interface Props {
    documentId: string
    ownersData: BoardOwnersData[]
    invites: Invite[]
}

export default BoardOwnersList
