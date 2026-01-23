'use client'
import { useToast } from '@entur/alert'
import { IconButton } from '@entur/button'
import { DeleteIcon } from '@entur/icons'
import { HiddenInput } from 'app/(admin)/components/Form/HiddenInput'
import { useActionState } from 'react'
import { FolderDB } from 'src/types/db-types/folders'
import { UserDB } from 'src/types/db-types/users'
import { removeUserAction } from './actions'

function RemoveUserButton({
    user,
    folderid,
}: {
    user?: UserDB
    folderid?: FolderDB['id']
}) {
    const [, deleteUser] = useActionState(removeUserAction, undefined)
    const { addToast } = useToast()

    const action = async (data: FormData) => {
        deleteUser(data)
        addToast('Medlem fjernet fra mappen')
    }

    return (
        <div className="flex w-full flex-col items-start">
            <form action={action} aria-live="polite" aria-relevant="all">
                <HiddenInput id="uid" value={user?.uid} />
                <HiddenInput id="folderid" value={folderid} />
                <IconButton type="submit" className="gap-2">
                    <DeleteIcon />
                    Fjern fra mappe
                </IconButton>
            </form>
        </div>
    )
}

export { RemoveUserButton }
