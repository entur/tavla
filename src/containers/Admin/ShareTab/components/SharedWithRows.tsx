import React from 'react'

import { IconButton } from '@entur/button'
import { CloseIcon } from '@entur/icons'
import { TableRow, DataCell } from '@entur/table'
import { Tooltip } from '@entur/tooltip'

import type { BoardOwnersData } from '../../../../types'

export const SharedWithRows = ({
    users,
    currentUserEmail,
    onRemove,
    statusText,
    tooltipTextRemove,
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
                                className="share-page__title__button"
                            >
                                <CloseIcon />
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
}

export default SharedWithRows
