'use client'
import { IconButton } from '@entur/button'
import { DeleteIcon } from '@entur/icons'
import { removeUserAction } from 'Admin/utils/formActions'
import { FormError } from 'app/(admin)/components/Login/FormError'
import { getFormFeedbackForField } from 'app/(admin)/utils'
import { HiddenInput } from 'components/Form/HiddenInput'
import { useFormState } from 'react-dom'
import { TOrganizationID, TUserID } from 'types/settings'

function RemoveUserButton({
    uid,
    oid,
}: {
    uid?: TUserID
    oid?: TOrganizationID
}) {
    const [state, formAction] = useFormState(removeUserAction, undefined)

    return (
        <form action={formAction}>
            <HiddenInput id="uid" value={uid} />
            <HiddenInput id="oid" value={oid} />
            <div className="flexRow">
                <FormError {...getFormFeedbackForField('general', state)} />
                <IconButton type="submit" aria-label="Fjern bruker">
                    <DeleteIcon />
                </IconButton>
            </div>
        </form>
    )
}

export { RemoveUserButton }
