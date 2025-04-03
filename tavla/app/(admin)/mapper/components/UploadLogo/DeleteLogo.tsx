'use client'
import { TLogo, TOrganizationID } from 'types/settings'
import { Button } from '@entur/button'
import { DeleteIcon } from '@entur/icons'
import { remove } from './actions'
import { TFormFeedback, getFormFeedbackForField } from 'app/(admin)/utils'
import { FormError } from 'app/(admin)/components/FormError'
import { useState } from 'react'
import { useToast } from '@entur/alert'

function DeleteLogo({ oid, logo }: { oid?: TOrganizationID; logo?: TLogo }) {
    const [deleteState, setDeleteState] = useState<TFormFeedback>()
    const { addToast } = useToast()
    return (
        <>
            <Button
                type="button"
                width="fluid"
                variant="secondary"
                onClick={async () => {
                    await remove(oid, logo).then((state) =>
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
