import { TColumnSettings, DefaultColumns } from 'types/column'

export function mergeDefaultColumns(columns?: TColumnSettings) {
    return { ...DefaultColumns, ...columns }
}
