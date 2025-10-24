'use client'
import { Dropdown } from '@entur/dropdown'
import { Heading4 } from '@entur/typography'
import { useFolders } from 'app/(admin)/hooks/useFolders'
import { HiddenInput } from 'components/Form/HiddenInput'
import { useEffect, useRef } from 'react'
import { FolderDB } from 'types/db-types/folders'

function Folder({
    folder,
    onChange,
}: {
    folder?: FolderDB
    onChange: () => void
}) {
    const { folders, selectedFolder, setSelectedFolder } = useFolders(folder)

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
                items={folders}
                label="Dine mapper"
                selectedItem={selectedFolder}
                onChange={setSelectedFolder}
                aria-required="true"
                className="mb-4"
            />
            <HiddenInput id="oldOid" value={folder?.id} />
            <HiddenInput id="newOid" value={selectedFolder?.value.id} />
        </div>
    )
}

export { Folder }
