import React from 'react'
import { IconButton } from '@entur/button'
import { CloseIcon, LoadingIcon } from '@entur/icons'
import { TableRow, DataCell } from '@entur/table'
import { Tooltip } from '@entur/tooltip'
import type { BoardOwnersData } from '../../../../types'

const SharedWithRows = ({
    users,
    currentUserEmail,
    onRemove,
    statusText,
    tooltipTextRemove,
    userEmailsBeingRemoved,
}: Props): JSX.Element => {
    const ownersFiltered = users.filter(
        (user) => user.email !== currentUserEmail,
    )

    return (
        <>
            {ownersFiltered.map((user) => (
                <TableRow key={user.email}>
                    <DataCell>{user.email}</DataCell>
                    <DataCell>{statusText}</DataCell>
                    <DataCell>
                        <Tooltip placement="bottom" content={tooltipTextRemove}>
                            <IconButton
                                onClick={() => onRemove(user)}
                                disabled={userEmailsBeingRemoved.includes(
                                    user.email,
                                )}
                            >
                                {userEmailsBeingRemoved.includes(user.email) ? (
                                    <LoadingIcon />
                                ) : (
                                    <CloseIcon />
                                )}
                            </IconButton>
                        </Tooltip>
                    </DataCell>
                </TableRow>
            ))}
        </>
    )
}

interface Props {
    users: BoardOwnersData[]
    currentUserEmail: string
    statusText: string
    tooltipTextRemove: string
    onRemove: (user: BoardOwnersData) => void
    userEmailsBeingRemoved: string[]
}

export { SharedWithRows }
