import { TColumn, TColumnSetting } from 'types/tile'

export function togglePlatform(columns: TColumnSetting[]): TColumnSetting[] {
    const PlatformIndex = 1

    if (columns[PlatformIndex].type === 'platform')
        return [
            ...columns.slice(0, PlatformIndex),
            ...columns.slice(PlatformIndex + 1),
        ]

    return [
        ...columns.slice(0, PlatformIndex),
        { type: 'platform' },
        ...columns.slice(PlatformIndex),
    ]
}

export function containsColumn(columns: TColumnSetting[], type: TColumn) {
    return -1 !== columns.findIndex((col) => col.type === type)
}
