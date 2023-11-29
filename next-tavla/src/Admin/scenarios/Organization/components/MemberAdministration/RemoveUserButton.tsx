'use client'
import { SmallAlertBox } from '@entur/alert'
import { IconButton } from '@entur/button'
import { DeleteIcon } from '@entur/icons'
import { removeUserAction } from 'Admin/utils/formActions'
import { HiddenInput } from 'components/Form/HiddenInput'
import { useFormState } from 'react-dom'
import { TOrganizationID, TUserID } from 'types/settings'
import { getFormStateProps } from 'utils/formStatuses'
import { FeedbackCode } from 'utils/formStatuses'

function SubmitButton() {
    return (
        <IconButton type="submit" aria-label="Fjern bruker">
            <DeleteIcon />
        </IconButton>
    )
}

function AlertBox({ code }: { code: FeedbackCode }) {
    const formStatusProps = getFormStateProps(code)

    return (
        <SmallAlertBox
            className="flexRow alignCenter p-1 mr-1"
            variant={formStatusProps?.variant ?? 'info'}
        >
            {formStatusProps?.feedback}
        </SmallAlertBox>
    )
}

function RemoveUserButton({
    uid,
    oid,
}: {
    uid?: TUserID
    oid?: TOrganizationID
}) {
    const [formState, formAction] = useFormState(removeUserAction, undefined)
    return (
        <form action={formAction}>
            <HiddenInput id="userId" value={uid} />
            <HiddenInput id="organizationId" value={oid} />
            <div className="flexRow">
                {formState && <AlertBox code={formState} />}
                <SubmitButton />
            </div>
        </form>
    )
}

export { RemoveUserButton }
