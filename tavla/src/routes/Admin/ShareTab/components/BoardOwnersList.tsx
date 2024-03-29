import React, { useCallback, useState } from 'react'
import { useUser } from 'settings/UserProvider'
import type { BoardOwnersData, Invite } from 'src/types'
import {
    removeFromFirebaseArray,
    removeSentBoardInviteAsOwner,
} from 'settings/firebase'
import { Table, TableHead, TableRow, HeaderCell, TableBody } from '@entur/table'
import { SharedWithRows } from './SharedWithRows'

function BoardOwnersList({
    documentId,
    ownersData,
    invites,
}: {
    documentId: string
    ownersData: BoardOwnersData[]
    invites: Invite[]
}) {
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

    const onRemoveOwnerFromBoard = useCallback(
        async (userToRemove: BoardOwnersData) => {
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
                await removeFromFirebaseArray(
                    documentId,
                    'owners',
                    userToRemove.uid,
                )
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
        },
        [documentId, ownersData, user?.uid, userEmailsBeingRemoved],
    )

    const onRemoveInviteFromBoard = useCallback(
        async (userToRemove: BoardOwnersData) => {
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
        },
        [documentId, user, userEmailsBeingRemoved],
    )

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

export { BoardOwnersList }
