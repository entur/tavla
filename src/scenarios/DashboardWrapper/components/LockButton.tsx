import React, { useState } from 'react'
import { LockModal } from 'components/AccountModals/LockModal/LockModal'
import { useSettings } from 'settings/SettingsProvider'
import { OpenedLockIcon } from '@entur/icons'
import { MenuButton } from './MenuButton'

function LockButton() {
    const [modalOpen, setModalOpen] = useState(false)
    const [settings] = useSettings()

    return (
        <>
            {!settings.owners.length && (
                <MenuButton
                    title="Lås tavle"
                    icon={<OpenedLockIcon size={21} />}
                    callback={(): void => setModalOpen(true)}
                    tooltip={
                        <>
                            Lås tavla til en konto slik <br />
                            at bare du kan redigere den.
                        </>
                    }
                />
            )}

            <LockModal
                open={modalOpen}
                onDismiss={(): void => setModalOpen(false)}
            />
        </>
    )
}

export { LockButton }
