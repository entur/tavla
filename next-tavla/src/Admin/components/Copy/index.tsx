import classes from './styles.module.css'
import { IconButton, PrimaryButton } from '@entur/button'
import { CopyIcon } from '@entur/icons'

function CopyText({ documentId }: { documentId: string }) {
    console.log(documentId)

    const linkURL = window.location.host + '/' + documentId

    return (
        <div>
            <div className={classes.copyLink}>
                <p>{linkURL}</p>
                <IconButton className={classes.copyButton}>
                    <CopyIcon />
                </IconButton>
            </div>
        </div>
    )
}

export { CopyText }
