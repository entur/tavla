import React from 'react'

import { IconButton } from '@entur/button'
import { CloseIcon } from '@entur/icons'
import { TableRow, DataCell } from '@entur/table'
import { Tooltip } from '@entur/tooltip'

import { BoardOwnersData } from '../../../../types'

export const SharedWithRows = ({
    users: owners,
    currentUserUID: userUID,
    onRemove,
    statusText,
    tooltipTextRemove,
}: Props): JSX.Element => {
    const ownersFiltered = owners.filter((owner) => owner.uid != userUID)

    return (
        <>
            {ownersFiltered.map((owner) => (
                <TableRow key={owner.uid}>
                    <DataCell>{owner.email}</DataCell>
                    <DataCell>{statusText}</DataCell>
                    <DataCell>
                        <Tooltip placement="bottom" content={tooltipTextRemove}>
                            <IconButton
                                onClick={() => onRemove(owner.uid)}
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
    currentUserUID: string
    statusText: string
    tooltipTextRemove: string
    onRemove: (UID: string) => void
}

export default SharedWithRows
