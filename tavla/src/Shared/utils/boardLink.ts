import { BoardDB } from 'types/db-types/boards'

export function getBoardLink(bid: BoardDB['id']) {
    const host = window.location.host
    if (!host) {
        return `https://vis-tavla.entur.no/${bid}`
    }
    switch (host) {
        case 'localhost:3000':
            return `http://localhost:5173/${bid}`
        case 'tavla.dev.entur.no':
            return `https://vis-tavla.dev.entur.no/${bid}`
        case 'tavla.entur.no':
        default:
            return `https://vis-tavla.entur.no/${bid}`
    }
}
