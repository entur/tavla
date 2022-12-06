import React from 'react'
import type { DocumentData } from 'firebase/firestore'
import { Contrast } from '@entur/layout'
import {
    Table,
    TableHead,
    TableRow,
    DataCell,
    HeaderCell,
    TableBody,
} from '@entur/table'
import { Board } from '../../../../types'
import { createTimeString } from '../../../../utils/time'

const ListView = ({ boards }: Props) => (
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
                        <DataCell>
                            {`${window.location.host}/t/${board.id}`}
                        </DataCell>
                        <DataCell>Her skal det komme en meny.knappp</DataCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </Contrast>
)
interface Props {
    boards: DocumentData
}
export { ListView }
