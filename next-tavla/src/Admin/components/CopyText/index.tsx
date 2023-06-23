import { Tooltip } from '@entur/tooltip'
import { CopyIcon } from '@entur/icons'
import classes from './styles.module.css'
import { useToast } from '@entur/alert'
import { TavlaButton } from '../Button'

function CopyText(props: { text: string; description: string }) {
    const { addToast } = useToast()

    return (
        <div className={classes.copyText}>
            <p>{props.text}</p>
            <Tooltip content={props.description} placement="top">
                <TavlaButton
                    className={classes.iconButton}
                    onClick={() => {
                        navigator.clipboard.writeText(props.text)
                        addToast('Kopiert')
                    }}
                >
                    <CopyIcon size={16} />
                </TavlaButton>
            </Tooltip>
        </div>
    )
}

export { CopyText }
