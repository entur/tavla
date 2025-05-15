'use client'
import { Dropdown } from '@entur/dropdown'
import { Heading4 } from '@entur/typography'
import { useFolders } from 'app/(admin)/hooks/useFolders'
import { HiddenInput } from 'components/Form/HiddenInput'
import { TFolder } from 'types/settings'

function Folder({ folder }: { folder?: TFolder }) {
    const { folders, selectedFolder, setSelectedFolder } = useFolders(folder)

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
