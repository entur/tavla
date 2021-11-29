import React, { useState } from 'react'

import { Table, TableHead, TableRow, HeaderCell, TableBody } from '@entur/table'

import { useUser } from '../../../../auth'

import type { BoardOwnersData, Invite } from '../../../../types'

import { removeSentBoardInviteAsOwner } from '../../../../services/firebase'

import { removeFromOwners } from '../../../../settings/FirestoreStorage'

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
        email: invite.receiver,
    }))
    const [userEmailsBeingRemoved, setUserEmailsBeingRemoved] = useState<
        string[]
    >([])

    const onRemoveOwnerFromBoard = async (
        userToRemove: BoardOwnersData,
    ): Promise<void> => {
        try {
            setUserEmailsBeingRemoved([
                ...userEmailsBeingRemoved,
                userToRemove.email,
            ])
            const ownersUids: string[] = ownersData.map(
                (owner: BoardOwnersData) => owner.uid,
            )
            if (!ownersUids.includes(user?.uid ?? ''))
                throw new Error('You are not an owner of this board.')
            await removeFromOwners(documentId, userToRemove.uid)
        } catch (error) {
            throw new Error(
                'Write error: could not remove owner from board. ' + error,
            )
        } finally {
            setUserEmailsBeingRemoved(
                userEmailsBeingRemoved.filter(
                    (email) => email !== userToRemove.email,
                ),
            )
        }
    }

    const onRemoveInviteFromBoard = async (
        userToRemove: BoardOwnersData,
    ): Promise<void> => {
        try {
            setUserEmailsBeingRemoved([
                ...userEmailsBeingRemoved,
                userToRemove.email,
            ])
            await removeSentBoardInviteAsOwner(
                documentId,
                user,
                userToRemove.email,
            )
        } catch (error) {
            throw new Error(
                'Write error: could not remove invite from board. ' + error,
            )
        } finally {
            setUserEmailsBeingRemoved(
                userEmailsBeingRemoved.filter(
                    (email) => email !== userToRemove.email,
                ),
            )
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
                    userEmailsBeingRemoved={userEmailsBeingRemoved}
                />
                <SharedWithRows
                    users={invitesMapped}
                    currentUserEmail={user?.uid ?? ''}
                    statusText="Venter på svar"
                    tooltipTextRemove="Fjern invitasjon"
                    onRemove={onRemoveInviteFromBoard}
                    userEmailsBeingRemoved={userEmailsBeingRemoved}
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
