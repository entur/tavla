import React, { useCallback, useState } from 'react'

import { useHistory } from 'react-router'

import copy from 'copy-to-clipboard'

import {
    ConfigurationIcon,
    ShareIcon,
    OpenedLockIcon,
    DeleteIcon,
} from '@entur/icons'
import { OverflowMenu, OverflowMenuItem, OverflowMenuLink } from '@entur/menu'
import { useToast } from '@entur/alert'

import '../styles.scss'

import RemoveLockModal from './Modals/RemoveLockModal'
import DeleteTavleModal from './Modals/DeleteTavleModal'

function BoardOverflowMenu({ id, uid }: Props): JSX.Element {
    const history = useHistory()
    const [removeLockModalOpen, setRemoveLockModalOpen] =
        useState<boolean>(false)
    const [deleteTavleModalOpen, setDeleteTavleModalOpen] =
        useState<boolean>(false)
    const overflowRedigerTavle = useCallback(() => {
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

    return (
        <>
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
                <OverflowMenuItem
                    onSelect={(): void => setRemoveLockModalOpen(true)}
                >
                    <span aria-hidden>
                        <OpenedLockIcon inline />
                    </span>
                    Lås opp
                </OverflowMenuItem>
                <OverflowMenuItem
                    onSelect={(): void => setDeleteTavleModalOpen(true)}
                >
                    <span aria-hidden>
                        <DeleteIcon inline />
                    </span>
                    Slett tavle
                </OverflowMenuItem>
            </OverflowMenu>

            <RemoveLockModal
                open={removeLockModalOpen}
                onDismiss={(): void => setRemoveLockModalOpen(false)}
                id={id}
                uid={uid}
            />
            <DeleteTavleModal
                open={deleteTavleModalOpen}
                onDismiss={(): void => setDeleteTavleModalOpen(false)}
                id={id}
            />
        </>
    )
}

interface Props {
    id: string
    uid: string
}

export default BoardOverflowMenu
