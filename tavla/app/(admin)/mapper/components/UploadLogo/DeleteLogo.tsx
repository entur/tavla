'use client'
import { useToast } from '@entur/alert'
import { Button } from '@entur/button'
import { DeleteIcon } from '@entur/icons'
import { FormError } from 'app/(admin)/components/FormError'
import { TFormFeedback, getFormFeedbackForField } from 'app/(admin)/utils'
import { useState } from 'react'
import { FolderIdDB, FolderLogoDB } from 'types/db-types/folders'
import { remove } from './actions'

function DeleteLogo({
    folderid,
    logo,
}: {
    folderid?: FolderIdDB
    logo?: FolderLogoDB
}) {
    const [deleteState, setDeleteState] = useState<TFormFeedback>()
    const { addToast } = useToast()
    return (
        <>
            <Button
                type="button"
                width="fluid"
                variant="secondary"
                onClick={async () => {
                    await remove(folderid, logo).then((state) =>
                        setDeleteState(state),
                    )
                    addToast('Logo slettet')
                }}
            >
                Slett logo
                <DeleteIcon />
            </Button>
            <FormError {...getFormFeedbackForField('general', deleteState)} />
        </>
    )
}

export { DeleteLogo }
