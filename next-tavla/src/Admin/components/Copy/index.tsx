import classes from './styles.module.css'
import { IconButton } from '@entur/button'
import { CopyIcon } from '@entur/icons'
import { Tooltip } from '@entur/tooltip'

function CopyText({ text }: { text: string }) {
    return (
        <div>
            <div className={classes.copyText}>
                <p>{text}</p>
                <Tooltip content="kopier" placement="top">
                    <IconButton
                        className={classes.copyButton}
                        onClick={() => {
                            navigator.clipboard.writeText(text)
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
