'use client'
import { useState } from 'react'
import { Button, IconButton } from '@entur/button'
import { TOrganizationID, TUser } from 'types/settings'
import { removeUserAction } from './actions'
import { useActionState } from 'react'
import { DeleteIcon } from '@entur/icons'

function RemoveUserButton({
    user,
    oid,
}: {
    user?: TUser
    oid?: TOrganizationID
}) {
    const [isConfirming, setIsConfirming] = useState(false)
    const [, deleteUser] = useActionState(removeUserAction, undefined)

    const handleDelete = async () => {
        const formData = new FormData()
        if (user?.uid) formData.append('uid', user.uid)
        if (oid) formData.append('oid', oid)
        deleteUser(formData)
        setIsConfirming(false)
    }

    return (
        <div className="flex items-center justify-center w-full h-full">
            {isConfirming ? (
                <div className="flex flex-row items-center gap-2">
                    <Button
                        variant="primary"
                        onClick={handleDelete}
                        aria-label="Ja, slett!"
                    >
                        Ja, slett!
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => setIsConfirming(false)}
                        aria-label="Avbryt"
                    >
                        Avbryt
                    </Button>
                </div>
            ) : (
                <IconButton
                    onClick={() => setIsConfirming(true)}
                    aria-label="Slett bruker"
                >
                    <DeleteIcon />
                </IconButton>
            )}
        </div>
    )
}

export { RemoveUserButton }
