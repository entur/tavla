import React, { useState } from 'react'
import { MineTavlerModal } from 'components/AccountModals/MineTavlerModal/MineTavlerModal'
import { UserIcon } from '@entur/icons'
import { MenuButton } from '../MenuButton/MenuButton'

function BoardsButton() {
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
