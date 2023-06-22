import { Tooltip } from '@entur/tooltip'
import { CopyIcon } from '@entur/icons'
import { IconButton } from '@entur/button'
import classes from './styles.module.css'
import { useToast } from '@entur/alert'

function CopyText(props: { text: string; description: string }) {
    const { addToast } = useToast()

    return (
        <div className={classes.copyText}>
            <p>{props.text}</p>
            <Tooltip content={props.description} placement="top">
                <IconButton
                    onClick={() => {
                        navigator.clipboard.writeText(props.text)
                        addToast('Kopiert')
                    }}
                >
                    <CopyIcon />
                </IconButton>
            </Tooltip>
        </div>
    )
}

export { CopyText }
