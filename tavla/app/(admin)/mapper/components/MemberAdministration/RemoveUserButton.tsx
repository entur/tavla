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
        <div className="flex flex-col items-start w-full">
            {!isConfirming && (
                <IconButton
                    onClick={() => setIsConfirming(true)}
                    aria-label="Slett bruker"
                >
                    <DeleteIcon />
                </IconButton>
            )}
            {isConfirming && (
                <div className="flex flex-col items-start gap-2 w-full">
                    <div className="flex flex-row items-center gap-2">
                        <Button
                            variant="primary"
                            size="small"
                            onClick={handleDelete}
                            aria-label="Ja, slett!"
                        >
                            Ja, slett!
                        </Button>
                        <Button
                            variant="secondary"
                            size="small"
                            onClick={() => setIsConfirming(false)}
                            aria-label="Avbryt"
                        >
                            Avbryt
                        </Button>
                    </div>
                    <p className="text-red-600 text-xs">
                        Er du sikker på at du vil slette denne brukeren?
                    </p>
                </div>
            )}
        </div>
    )
}

export { RemoveUserButton }
