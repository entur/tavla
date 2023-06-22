import { Tooltip } from '@entur/tooltip'
import { CopyIcon } from '@entur/icons'
import { IconButton } from '@entur/button'
import classes from './styles.module.css'
import { useToast } from '@entur/alert'

function CopyText({ text }: { text: string }) {
    const { addToast } = useToast()

    return (
        <div className={classes.copyText}>
            <p>{text}</p>
            <Tooltip content="Kopier lenke" placement="top">
                <IconButton
                    onClick={() => {
                        navigator.clipboard.writeText(text)
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
