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
            addToast('Lenken til tavlen ble kopiert!')
        } catch (error) {
            addToast('Kunne ikke kopiere lenken. Prøv igjen.')
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
