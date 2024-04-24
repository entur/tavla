'use client'
import { useToast } from '@entur/alert'
import { Button, IconButton } from '@entur/button'
import { CopyIcon } from '@entur/icons'
import { Tooltip } from '@entur/tooltip'
import { useLink } from 'hooks/useLink'

function Copy({ type, bid }: { type?: 'button' | 'icon'; bid?: string }) {
    const { addToast } = useToast()
    const link = useLink(bid)
    const copy = () => {
        navigator.clipboard.writeText(link ?? '')
        addToast('Lenke til Tavla kopiert')
    }

    if (type === 'button') {
        return (
            <Button
                variant="secondary"
                aria-label="Kopier tavle"
                className="flex flex-row justify-center items-center"
                onClick={copy}
            >
                Kopier Tavle
                <CopyIcon />
            </Button>
        )
    }
    return (
        <Tooltip content="Kopier lenke" placement="bottom">
            <IconButton aria-label="Kopier tavle" onClick={copy}>
                <CopyIcon />
            </IconButton>
        </Tooltip>
    )
}
export { Copy }
