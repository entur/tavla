'use client'
import { useToast } from '@entur/alert'
import { IconButton } from '@entur/button'
import { DeleteIcon } from '@entur/icons'
import { HiddenInput } from 'components/Form/HiddenInput'
import { useActionState } from 'react'
import { TFolderID, TUser } from 'types/settings'
import { removeUserAction } from './actions'

function RemoveUserButton({ user, oid }: { user?: TUser; oid?: TFolderID }) {
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
                <HiddenInput id="oid" value={oid} />
                <IconButton type="submit" className="gap-2">
                    <DeleteIcon />
                    Fjern fra mappe
                </IconButton>
            </form>
        </div>
    )
}

export { RemoveUserButton }
