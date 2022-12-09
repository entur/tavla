import React, { useState } from 'react'
import { UserIcon } from '@entur/icons'
import { MineTavlerModal } from '../../../../components/MineTavlerModal/MineTavlerModal'
import { MenuButton } from '../MenuButton/MenuButton'

const BoardsButton = () => {
    const [modalOpen, setModalOpen] = useState(false)

    return (
        <>
            <MenuButton
                title="Mine tavler"
                icon={<UserIcon size={21} />}
                callback={(): void => setModalOpen(true)}
            />
            <MineTavlerModal
                open={modalOpen}
                onDismiss={(): void => setModalOpen(false)}
            />
        </>
    )
}

export { BoardsButton }
