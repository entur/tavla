// TODO: remove 15. december when new lines are active
// Remember to do a migration script in Firestore beforehand

import { TBoard } from 'types/settings'
import { TTile } from 'types/tile'

export const SWITCH_DATE = new Date(2024, 11, 15)

export function makeBoardCompatible(board: TBoard): TBoard {
    const updatedTiles = board.tiles.map(({ whitelistedLines, ...tile }) => ({
        ...tile,
        ...(whitelistedLines && {
            whitelistedLines: whitelistedLines.flatMap(oldLineIdsToNew),
        }),
    })) as TTile[]
    return { ...board, tiles: updatedTiles }
}

function oldLineIdsToNew(lineId: string): string | string[] {
    switch (lineId) {
        case 'VYG:Line:41':
            return [lineId, 'VYG:Line:F4']
        case 'VYG:Line:45':
            return [lineId, 'VYG:Line:R40']
        case 'VYG:Line:43':
            return [lineId, 'VYG:Line:L4']
        case 'FLB:Line:42':
            return [lineId, 'VYG:Line:R45']
        case 'VYG:Line:70':
            return [lineId, 'VYG:Line:F1']
        case 'NSB:Line:R20':
            return [lineId, 'VYG:Line:RE20']
        case 'NSB:Line:RX20':
            return [lineId, 'VYG:Line:RX20']
        case 'NSB:Line:L21':
            return [lineId, 'VYG:Line:R21']
        case 'NSB:Line:L22':
            return [lineId, 'VYG:Line:R22']
        case 'NSB:Line:R23':
            return [lineId, 'VYG:Line:R23']
        case 'NSB:Line:R23x':
            return [lineId, 'VYG:Line:R23x']
        case 'NSB:Line:L2':
            return [lineId, 'VYG:Line:L2']
        case 'NSB:Line:L2x':
            return [lineId, 'VYG:Line:L2x']
        case 'GJB:Line:R30':
            return [lineId, 'VYG:Line:RE30']
        case 'GJB:Line:L3':
            return [lineId, 'VYG:Line:R31']
        case 'NSB:Line:R10':
            return [lineId, 'VYG:Line:RE10']
        case 'NSB:Line:R11':
            return [lineId, 'VYG:Line:RE11']
        case 'NSB:Line:RX11':
            return [lineId, 'VYG:Line:RX11']
        case 'NSB:Line:L12':
            return [lineId, 'VYG:Line:R12']
        case 'NSB:Line:L13':
            return [lineId, 'VYG:Line:R13']
        case 'NSB:Line:R13x':
            return [lineId, 'VYG:Line:R13x']
        case 'NSB:Line:L14':
            return [lineId, 'VYG:Line:R14']
        case 'NSB:Line:52':
            return [lineId, 'VYG:Line:R55']
        case 'NSB:Line:L1':
            return [lineId, 'VYG:Line:L1']

        default:
            return lineId
    }
}

export const OLD_LINE_IDS = [
    'VYG:Line:41',
    'VYG:Line:45',
    'VYG:Line:43',
    'FLB:Line:42',
    'VYG:Line:70',
    'NSB:Line:R20',
    'NSB:Line:RX20',
    'NSB:Line:L21',
    'NSB:Line:L22',
    'NSB:Line:R23',
    'NSB:Line:R23x',
    'NSB:Line:L2',
    'NSB:Line:L2x',
    'GJB:Line:R30',
    'GJB:Line:L3',
    'NSB:Line:R10',
    'NSB:Line:R11',
    'NSB:Line:RX11',
    'NSB:Line:L12',
    'NSB:Line:L13',
    'NSB:Line:R13x',
    'NSB:Line:L14',
    'NSB:Line:52',
    'NSB:Line:L1',
]

export const NEW_LINE_IDS = [
    'VYG:Line:F4',
    'VYG:Line:R40',
    'VYG:Line:L4',
    'VYG:Line:R45',
    'VYG:Line:F1',
    'VYG:Line:RE20',
    'VYG:Line:RX20',
    'VYG:Line:R21',
    'VYG:Line:R22',
    'VYG:Line:R23',
    'VYG:Line:R23x',
    'VYG:Line:L2',
    'VYG:Line:L2x',
    'VYG:Line:RE30',
    'VYG:Line:R31',
    'VYG:Line:RE10',
    'VYG:Line:RE11',
    'VYG:Line:RX11',
    'VYG:Line:R12',
    'VYG:Line:R13',
    'VYG:Line:R13x',
    'VYG:Line:R14',
    'VYG:Line:R55',
    'VYG:Line:L1',
]
