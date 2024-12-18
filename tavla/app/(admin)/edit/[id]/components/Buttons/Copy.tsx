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
                aria-label="Kopier lenken til tavlen"
                onClick={copy}
            >
                Kopier lenke
                <CopyIcon className="!top-[-1px]" />
            </Button>
        )
    }
    return (
        <Tooltip
            content="Kopier lenken til tavlen"
            placement="bottom"
            id="tooltip-copy-link-board"
        >
            <IconButton aria-label="Kopier lenken til tavlen" onClick={copy}>
                <CopyIcon />
            </IconButton>
        </Tooltip>
    )
}
export { Copy }
