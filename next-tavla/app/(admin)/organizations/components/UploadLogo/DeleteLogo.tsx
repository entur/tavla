'use client'
import { TLogo, TOrganizationID } from 'types/settings'
import classes from './styles.module.css'
import { Button } from '@entur/button'
import { DeleteIcon, ImageIcon } from '@entur/icons'
import { remove } from './actions'
import { getFilename } from './utils'
import { TFormFeedback, getFormFeedbackForField } from 'app/(admin)/utils'
import { FormError } from 'app/(admin)/components/FormError'
import { useState } from 'react'
import { useToast } from '@entur/alert'

function DeleteLogo({ oid, logo }: { oid?: TOrganizationID; logo?: TLogo }) {
    const [deleteState, setDeleteState] = useState<TFormFeedback>()
    const { addToast } = useToast()
    return (
        <>
            <div className={classes.card}>
                <div className="flexRow alignCenter g-2">
                    <ImageIcon size={24} />
                    {getFilename(logo).replace(`${oid}-`, '')}
                </div>
                <Button
                    type="button"
                    variant="secondary"
                    onClick={async () => {
                        await remove(oid, logo).then((state) =>
                            setDeleteState(state),
                        )
                        addToast('Logo slettet')
                    }}
                >
                    Slett
                    <DeleteIcon className="mr-1" />
                </Button>
            </div>
            <FormError {...getFormFeedbackForField('general', deleteState)} />
        </>
    )
}

export { DeleteLogo }
