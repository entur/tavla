'use client'
import { useToast } from '@entur/alert'
import { Button, IconButton } from '@entur/button'
import { CopyIcon } from '@entur/icons'
import { Tooltip } from '@entur/tooltip'
import ClientOnlyComponent from 'app/components/NoSSR/ClientOnlyComponent'
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
        <ClientOnlyComponent>
            <Tooltip content="Kopier lenken til tavlen" placement="bottom">
                <IconButton
                    aria-label="Kopier lenken til tavlen"
                    onClick={copy}
                >
                    <CopyIcon />
                </IconButton>
            </Tooltip>
        </ClientOnlyComponent>
    )
}
export { Copy }
