import { useCallback } from 'react'
import { IconButton } from '@entur/button'
import {
    useBoardsSettings,
    useBoardsSettingsDispatch,
} from '../../utils/context'
import { TBoardsColumn } from 'Admin/types/boards'
import { DownArrowIcon, UnsortedIcon, UpArrowIcon } from '@entur/icons'

function Sort({ column }: { column: TBoardsColumn }) {
    const settings = useBoardsSettings()
    const dispatch = useBoardsSettingsDispatch()

    const Icon = useCallback(() => {
        switch (settings.sort.type) {
            case 'ascending':
                return <UpArrowIcon />
            case 'descending':
                return <DownArrowIcon />
            default:
                return <UnsortedIcon />
        }
    }, [])

    return (
        <IconButton>
            {settings.sort.column === column ? <Icon /> : <UnsortedIcon />}
        </IconButton>
    )
}

export { Sort }
