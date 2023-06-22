import { Tooltip } from '@entur/tooltip'
import { CopyIcon } from '@entur/icons'
import { IconButton } from '@entur/button'
import classes from './styles.module.css'

function CopyText({ text }: { text: string }) {
    return (
        <div className={classes.copyText}>
            <p>{text}</p>
            <Tooltip content="kopier" placement="top">
                <IconButton
                    onClick={() => {
                        navigator.clipboard.writeText(text)
                    }}
                >
                    <CopyIcon />
                </IconButton>
            </Tooltip>
        </div>
    )
}

export { CopyText }
