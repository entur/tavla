import React from 'react'
import copy from 'copy-to-clipboard'
import { useToast } from '@entur/alert'
import { CopyIcon } from '@entur/icons'
import { MenuButton } from '../MenuButton/MenuButton'

function CopyButton() {
    const { addToast } = useToast()

    return (
        <MenuButton
            title="Kopier lenke"
            icon={<CopyIcon size={21} />}
            callback={(): void => {
                copy(window.location.href)
                addToast({
                    title: 'Kopiert',
                    content:
                        'Linken har nå blitt kopiert til din utklippstavle.',
                    variant: 'success',
                })
            }}
        />
    )
}

export { CopyButton }
