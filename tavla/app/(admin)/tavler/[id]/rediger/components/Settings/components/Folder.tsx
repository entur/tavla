'use client'
import { Dropdown } from '@entur/dropdown'
import { Heading4 } from '@entur/typography'
import { HiddenInput } from 'app/(admin)/components/Form/HiddenInput'
import { useFolderDropdown } from 'app/(admin)/hooks/useFolders'
import { useEffect, useRef } from 'react'
import { FolderDB } from 'src/types/db-types/folders'

function Folder({
    folder,
    onChange,
}: {
    folder?: FolderDB
    onChange: () => void
}) {
    const { folderDropdownList, selectedFolder, handleFolderChange } =
        useFolderDropdown(folder)

    const isFirstRender = useRef(true)

    //Wait until selectedPoint is set before calling onChange to ensure the form is updated correctly
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false
            return
        }
        onChange()
    }, [selectedFolder, onChange])

    return (
        <div>
            <Heading4 margin="bottom">Mappe</Heading4>
            <Dropdown
                items={folderDropdownList}
                label="Dine mapper"
                selectedItem={selectedFolder}
                onChange={handleFolderChange}
                aria-required="true"
                className="mb-4"
            />
            <HiddenInput id="oldOid" value={folder?.id} />
            <HiddenInput id="newOid" value={selectedFolder?.value?.id} />
        </div>
    )
}

export { Folder }
