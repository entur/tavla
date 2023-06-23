import { CopyIcon } from '@entur/icons'
import classes from './styles.module.css'
import { useToast } from '@entur/alert'
import { TavlaButton } from '../Button'

function CopyText(props: { text: string; toastText: string }) {
    const { addToast } = useToast()

    return (
        <div className={classes.copyText}>
            <p>{props.text}</p>
            <TavlaButton
                className={classes.iconButton}
                onClick={() => {
                    navigator.clipboard.writeText(props.text)
                    addToast(props.toastText)
                }}
            >
                <CopyIcon size={16} />
            </TavlaButton>
        </div>
    )
}

export { CopyText }
