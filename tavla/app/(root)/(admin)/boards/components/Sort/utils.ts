import { TSort } from 'app/(root)/(admin)/utils/types'

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
