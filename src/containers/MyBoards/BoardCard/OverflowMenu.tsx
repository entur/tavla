import React, { useCallback } from 'react'

import {
    ConfigurationIcon,
    ShareIcon,
    OpenedLockIcon,
    DeleteIcon,
} from '@entur/icons'
import { OverflowMenu, OverflowMenuItem, OverflowMenuLink } from '@entur/menu'
import { useToast } from '@entur/alert'

import {
    removeFromOwners,
    deleteTavle,
} from '../../../settings/FirestoreStorage'
import copy from 'copy-to-clipboard'

import './styles.scss'

function BoardOverflowMenu({ id, uid, history }: Props): JSX.Element {
    const overflowRedigerTavle = useCallback(() => {
        event.preventDefault()
        history.push(`/admin/${id}`)
    }, [id, history])

    const { addToast } = useToast()
    const overflowShareTavle = (): void => {
        copy(`${window.location.host}/t/${id}`)
        addToast({
            title: 'Kopiert',
            content: 'Linken har nå blitt kopiert til din utklippstavle.',
            variant: 'success',
        })
    }

    const overflowUnlockTavle = useCallback(() => {
        event.preventDefault()
        removeFromOwners(id, uid)
    }, [id, uid])

    const overflowDeleteTavle = useCallback(() => {
        event.preventDefault()
        deleteTavle(id)
    }, [id])

    return (
        <OverflowMenu className="board-card__text-container__top-wrapper__overflow">
            <OverflowMenuLink onSelect={overflowRedigerTavle}>
                <span aria-hidden>
                    <ConfigurationIcon inline />
                </span>
                Rediger tavle
            </OverflowMenuLink>
            <OverflowMenuItem onSelect={overflowShareTavle}>
                <span aria-hidden>
                    <ShareIcon inline />
                </span>
                Del tavle
            </OverflowMenuItem>
            <OverflowMenuItem onSelect={overflowUnlockTavle}>
                <span aria-hidden>
                    <OpenedLockIcon inline />
                </span>
                Lås opp
            </OverflowMenuItem>
            <OverflowMenuItem onSelect={overflowDeleteTavle}>
                <span aria-hidden>
                    <DeleteIcon inline />
                </span>
                Slett tavle
            </OverflowMenuItem>
        </OverflowMenu>
    )
}

interface Props {
    id: string
    uid: string
    history: any
}

export default BoardOverflowMenu
