import { TSort } from 'Admin/types/boards'

export function getAriaLabel(sort: TSort) {
    switch (sort) {
        case 'ascending':
            return 'Sortert stigende'
        case 'descending':
            return 'Sortert synkende'
        default:
            return 'Ikke sortert'
    }
}
