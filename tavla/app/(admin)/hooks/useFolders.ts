import { NormalizedDropdownItemType } from '@entur/dropdown'
import { FolderIcon } from '@entur/icons'
import { useCallback, useEffect, useState } from 'react'
import { FolderDB } from 'types/db-types/folders'
import { getFoldersForUser } from '../actions'

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

function useFolderDropdown(folder?: FolderDB) {
    const [folderDropdownList, setFolderList] = useState<FolderDropdownItem[]>([
        NO_FOLDER_OPTION,
    ])
    const [selectedFolder, setSelectedFolder] = useState<FolderDropdownItem>(
        folder ? toDropdownItem(folder) : NO_FOLDER_OPTION,
    )

    useEffect(() => {
        getFoldersForUser().then((res) => {
            const dropdownFolderItems = res?.map(toDropdownItem) ?? []
            setFolderList([NO_FOLDER_OPTION, ...dropdownFolderItems])
        })
    }, [])

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
