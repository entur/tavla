import { TLogo, TOrganizationID } from 'types/settings'
import classes from './styles.module.css'
import { Button } from '@entur/button'
import { DeleteIcon, ImageIcon } from '@entur/icons'
import { remove } from './actions'
import { getFilename } from './utils'

function DeleteLogo({ oid, logo }: { oid?: TOrganizationID; logo?: TLogo }) {
    return (
        <div className={classes.card}>
            <div className="flexRow alignCenter g-1">
                <ImageIcon />
                {getFilename(logo).replace(`${oid}-`, '')}
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
