import classes from './styles.module.css'
import { IconButton, PrimaryButton } from '@entur/button'
import { CopyIcon } from '@entur/icons'
import { Tooltip } from '@entur/tooltip'

function CopyText({ documentId }: { documentId: string }) {
    console.log(documentId)

    const linkURL = window.location.host + '/' + documentId

    return (
        <div>
            <div className={classes.copyLink}>
                <p>{linkURL}</p>
                <Tooltip content="kopier lenke" placement="top">
                    <IconButton
                        className={classes.copyButton}
                        onClick={() => {
                            navigator.clipboard.writeText(linkURL)
                        }}
                    >
                        <CopyIcon />
                    </IconButton>
                </Tooltip>
            </div>
        </div>
    )
}

export { CopyText }
