import { NormalizedDropdownItemType } from '@entur/dropdown'
import { FolderIcon } from '@entur/icons'
import { useCallback, useEffect, useState } from 'react'
import { FolderDB } from 'src/types/db-types/folders'
import { getFoldersForUser } from '../actions'
import { Folder } from '../utils/types'

type FolderDropdownItem = NormalizedDropdownItemType<FolderDB | null>

const NO_FOLDER_OPTION: FolderDropdownItem = {
    value: null,
    label: 'Ingen mappe',
}

const toDropdownItem = (folder: FolderDB): FolderDropdownItem => ({
    value: folder,
    label: folder.name ?? '',
    icons: [FolderIcon],
})

function useFolderDropdown(folder?: FolderDB, foldersForUser?: Folder[]) {
    const [folderDropdownList, setFolderList] = useState<FolderDropdownItem[]>([
        NO_FOLDER_OPTION,
    ])
    const [selectedFolder, setSelectedFolder] = useState<FolderDropdownItem>(
        folder ? toDropdownItem(folder) : NO_FOLDER_OPTION,
    )

    useEffect(() => {
        const setDropdownList = (folders: FolderDB[]) => {
            const dropdownFolderItems = folders.map(toDropdownItem)
            setFolderList([NO_FOLDER_OPTION, ...dropdownFolderItems])
        }

        if (foldersForUser) {
            setDropdownList(foldersForUser)
        } else {
            getFoldersForUser().then((res) => {
                setDropdownList(res ?? [])
            })
        }
    }, [foldersForUser])

    const handleFolderChange = useCallback(
        (item?: FolderDropdownItem | null) => {
            setSelectedFolder(item ?? NO_FOLDER_OPTION)
        },
        [],
    )

    return {
        folderDropdownList,
        selectedFolder,
        handleFolderChange,
    }
}

export { useFolderDropdown }
export type { FolderDropdownItem }
