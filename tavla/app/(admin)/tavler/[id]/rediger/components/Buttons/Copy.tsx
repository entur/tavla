'use client'
import { CopyableText, useToast } from '@entur/alert'
import { IconButton } from '@entur/button'
import { CopyIcon } from '@entur/icons'
import { Tooltip } from '@entur/tooltip'
import { useLink } from 'hooks/useLink'

function Copy({ type, bid }: { type?: 'button' | 'icon'; bid?: string }) {
    const { addToast } = useToast()
    const link = useLink(bid)
    const copy = async () => {
        if (!link) {
            addToast('Lenken er ikke tilgjengelig for kopiering.')
            return
        }

        try {
            await navigator.clipboard.writeText(link)
            addToast({
                content: 'Lenken til tavlen ble kopiert!',
                variant: 'success',
            })
        } catch {
            addToast({
                content: 'Kunne ikke kopiere lenken. Prøv igjen.',
                variant: 'information', //TODO: should be error, but the design system have to be bumped up
            })
        }
    }

    if (type === 'button') {
        if (link) {
            return (
                <CopyableText
                    successHeading=""
                    successMessage="Lenken til tavlen ble kopiert!"
                    aria-label="Kopier lenken til tavlen"
                >
                    {link.toString()}
                </CopyableText>
            )
        }
        return
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
