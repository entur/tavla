import { NormalizedDropdownItemType } from '@entur/dropdown'
import { FolderIcon } from '@entur/icons'
import { useCallback, useEffect, useState } from 'react'
import { TFolder } from 'types/settings'
import { getFoldersForUser } from '../actions'
import { folderToDropdownItem } from '../tavler/[id]/utils'

const NO_FOLDER = {
    value: {},
    label: 'Ingen mappe',
}

function useFolders(folder?: TFolder) {
    const [folderList, setFolderList] = useState<
        NormalizedDropdownItemType<TFolder>[]
    >([])

    const [selectedFolder, setSelectedFolder] =
        useState<NormalizedDropdownItemType<TFolder> | null>(
            folder ? folderToDropdownItem(folder) : NO_FOLDER,
        )

    useEffect(() => {
        getFoldersForUser().then((res) => {
            const folders = res?.map((folder) => ({
                value: folder ?? undefined,
                label: folder.name ?? '',
                icons: [FolderIcon],
            }))
            setFolderList([...folders, NO_FOLDER])
        })
    }, [])

    const folders = useCallback(() => folderList, [folderList])

    return { folders, selectedFolder, setSelectedFolder }
}

export { useFolders }
