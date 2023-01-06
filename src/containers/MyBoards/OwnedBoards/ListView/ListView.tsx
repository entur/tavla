import React, { useCallback } from 'react'
import type { DocumentData } from 'firebase/firestore'
import type { User } from 'firebase/auth'
import copy from 'copy-to-clipboard'
import { Contrast } from '@entur/layout'
import {
    Table,
    TableHead,
    TableRow,
    DataCell,
    HeaderCell,
    TableBody,
} from '@entur/table'
import { CopyIcon, ExternalIcon } from '@entur/icons'
import { IconButton } from '@entur/button'
import { useToast } from '@entur/alert'
import { Tooltip } from '@entur/tooltip'
import { Board } from '../../../../types'
import { createTimeString } from '../../../../utils/time'
import { BoardOverflowMenu } from '../BoardCard/OverflowMenu/BoardOverflowMenu'
import classes from './ListView.module.scss'

const ListView = ({ boards, user }: Props) => {
    const { addToast } = useToast()

    const handleCopy = useCallback(
        (boardId: string) => () => {
            copy(`${window.location.host}/t/${boardId}`)
            addToast({
                title: 'Kopiert',
                content: 'Linken har nå blitt kopiert til din utklippstavle.',
                variant: 'success',
            })
        },
        [addToast],
    )

    return (
        <Contrast>
            <Table>
                <TableHead>
                    <TableRow>
                        <HeaderCell>Navn på tavle</HeaderCell>
                        <HeaderCell>Visningstype</HeaderCell>
                        <HeaderCell>Sist endret</HeaderCell>
                        <HeaderCell>URL-adresse</HeaderCell>
                        <HeaderCell>Meny</HeaderCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {boards.map((board: Board) => (
                        <TableRow key={board.id}>
                            <DataCell>{board.data.boardName}</DataCell>
                            <DataCell>{board.data.dashboard}</DataCell>
                            <DataCell>
                                {createTimeString(board.lastmodified.toDate())}{' '}
                            </DataCell>
                            <DataCell className={classes.Url}>
                                {`${window.location.host}/t/${board.id}`}{' '}
                                <Tooltip
                                    content="Trykk for å kopiere lenken."
                                    placement="top"
                                >
                                    <IconButton onClick={handleCopy(board.id)}>
                                        <CopyIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip
                                    content="Trykk for å åpne i ny fane."
                                    placement="top"
                                >
                                    <IconButton
                                        as="a"
                                        href={`http://${window.location.host}/t/${board.id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <ExternalIcon />
                                    </IconButton>
                                </Tooltip>
                            </DataCell>
                            <DataCell>
                                <div className={classes.Center}>
                                    Valg{' '}
                                    <BoardOverflowMenu
                                        id={board.id}
                                        uid={user.uid}
                                        showCopy={false}
                                    />
                                </div>
                            </DataCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Contrast>
    )
}
interface Props {
    boards: DocumentData
    user: User
}
export { ListView }
