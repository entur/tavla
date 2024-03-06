import { TLogo, TOrganizationID } from 'types/settings'
import classes from './styles.module.css'
import { Button } from '@entur/button'
import { DeleteIcon, ImageIcon } from '@entur/icons'
import { remove } from './actions'
import { getFilename } from './utils'
import { TFormFeedback, getFormFeedbackForField } from 'app/(admin)/utils'
import { FormError } from 'app/(admin)/components/FormError'

function DeleteLogo({
    oid,
    logo,
    state,
}: {
    oid?: TOrganizationID
    logo?: TLogo
    state: TFormFeedback | undefined
}) {
    return (
        <div className={classes.card}>
            <div className="flexRow alignCenter g-1">
                <ImageIcon />
                {getFilename(logo).replace(`${oid}-`, '')}
            </div>
            <div className="mt-2">
                <FormError {...getFormFeedbackForField('general', state)} />
            </div>
            <Button
                type="button"
                variant="secondary"
                onClick={async () => {
                    await remove(oid, logo)
                }}
            >
                Slett
                <DeleteIcon className="mr-1" />
            </Button>
        </div>
    )
}

export { DeleteLogo }
