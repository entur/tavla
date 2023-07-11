import { CopyIcon } from '@entur/icons'
import { useToast } from '@entur/alert'
import { Button } from '@entur/button'

function CopyText({ text, toastText }: { text: string; toastText: string }) {
    const { addToast } = useToast()

    return (
        <Button
            width="auto"
            variant={'primary'}
            onClick={() => {
                navigator.clipboard.writeText(text)
                addToast(toastText)
            }}
        >
            {text}
            <CopyIcon size={16} />
        </Button>
    )
}

export { CopyText }
