import { TLogo, TOrganizationID } from 'types/settings'
import classes from './styles.module.css'
import { IconButton } from '@entur/button'
import { DeleteIcon, ImageIcon } from '@entur/icons'
import { remove } from './actions'

function LogoTile({ oid, logo }: { oid?: TOrganizationID; logo?: TLogo }) {
    return (
        <div className={classes.card}>
            <div className="flexRow alignCenter g-1">
                <ImageIcon />
                {logo}
            </div>
            <IconButton
                type="button"
                onClick={async () => {
                    await remove(oid, logo)
                }}
            >
                <DeleteIcon className="mr-1" />
                Fjern
            </IconButton>
        </div>
    )
}

export { LogoTile }
