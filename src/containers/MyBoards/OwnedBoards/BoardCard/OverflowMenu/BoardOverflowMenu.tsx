import React, { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import copy from 'copy-to-clipboard'
import {
    ConfigurationIcon,
    OpenedLockIcon,
    DeleteIcon,
    CloseIcon,
    CopyIcon,
} from '@entur/icons'
import { OverflowMenu, OverflowMenuItem, OverflowMenuLink } from '@entur/menu'
import { useToast } from '@entur/alert'
import { RemoveLockModal } from '../../../../../components/OverflowModals/RemoveLockModal'
import { DeleteTavleModal } from '../../../../../components/OverflowModals/DeleteTavleModal'
import { RemoveSelfFromTavleModal } from '../../../../../components/OverflowModals/RemoveSelfFromTavleModal'

function BoardOverflowMenu({
    id,
    uid,
    sharedBoard = false,
    showCopy = true,
}: Props): JSX.Element {
    const navigate = useNavigate()
    const [removeLockModalOpen, setRemoveLockModalOpen] =
        useState<boolean>(false)
    const [deleteTavleModalOpen, setDeleteTavleModalOpen] =
        useState<boolean>(false)
    const [removeSelfFromTavleModalOpen, setRemoveSelfFromTavleModalOpen] =
        useState<boolean>(false)
    const overflowEditTavle = useCallback(() => {
        navigate(`/admin/${id}`)
    }, [id, navigate])

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
            <OverflowMenu>
                <OverflowMenuLink onSelect={overflowEditTavle}>
                    <span aria-hidden>
                        <ConfigurationIcon inline />
                    </span>
                    Rediger tavle
                </OverflowMenuLink>
                {showCopy && (
                    <OverflowMenuItem onSelect={overflowShareTavle}>
                        <span aria-hidden>
                            <CopyIcon inline />
                        </span>
                        Kopier lenke
                    </OverflowMenuItem>
                )}
                {sharedBoard ? (
                    <OverflowMenuItem
                        onSelect={(): void =>
                            setRemoveSelfFromTavleModalOpen(true)
                        }
                    >
                        <span aria-hidden>
                            <CloseIcon inline />
                        </span>
                        Forlat tavle
                    </OverflowMenuItem>
                ) : (
                    <OverflowMenuItem
                        onSelect={(): void => setRemoveLockModalOpen(true)}
                    >
                        <span aria-hidden>
                            <OpenedLockIcon inline />
                        </span>
                        Lås opp
                    </OverflowMenuItem>
                )}
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
            <RemoveSelfFromTavleModal
                open={removeSelfFromTavleModalOpen}
                onDismiss={(): void => setRemoveSelfFromTavleModalOpen(false)}
                id={id}
                uid={uid}
            />
        </>
    )
}

interface Props {
    id: string
    uid: string
    sharedBoard?: boolean
    showCopy?: boolean
}

export { BoardOverflowMenu }
