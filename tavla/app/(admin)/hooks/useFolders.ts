import { NormalizedDropdownItemType } from '@entur/dropdown'
import { FolderIcon } from '@entur/icons'
import { useCallback, useEffect, useState } from 'react'
import { FolderDB } from 'types/db-types/folders'
import { getFoldersForUser } from '../actions'
import { folderToDropdownItem } from '../tavler/[id]/utils'

const NO_FOLDER = {
    value: {},
    label: 'Ingen mappe',
}

function useFolders(folder?: FolderDB) {
    const [folderList, setFolderList] = useState<
        NormalizedDropdownItemType<FolderDB>[]
    >([])

    const [selectedFolder, setSelectedFolder] =
        useState<NormalizedDropdownItemType<FolderDB> | null>(
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
