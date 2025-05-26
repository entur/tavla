'use client'
import { TOrganizationID, TUser } from 'types/settings'
import { removeUserAction } from './actions'
import { useActionState } from 'react'
import { HiddenInput } from 'components/Form/HiddenInput'
import { DeleteIcon } from '@entur/icons'
import { IconButton } from '@entur/button'

function RemoveUserButton({
    user,
    oid,
}: {
    user?: TUser
    oid?: TOrganizationID
}) {
    const [, deleteUser] = useActionState(removeUserAction, undefined)

    return (
        <div className="flex w-full flex-col items-start">
            <form action={deleteUser} aria-live="polite" aria-relevant="all">
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
