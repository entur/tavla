import { CopyIcon } from '@entur/icons'
import classes from './styles.module.css'
import { useToast } from '@entur/alert'
import { TavlaButton } from '../Button'

function CopyText({ text, toastText }: { text: string; toastText: string }) {
    const { addToast } = useToast()

    return (
        <div className={classes.copyText}>
            <p>{text}</p>
            <TavlaButton
                className={classes.copyIcon}
                onClick={() => {
                    navigator.clipboard.writeText(text)
                    addToast(toastText)
                }}
            >
                <CopyIcon size={16} />
            </TavlaButton>
        </div>
    )
}

export { CopyText }
