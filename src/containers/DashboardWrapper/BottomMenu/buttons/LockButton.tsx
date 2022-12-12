import React, { useState } from 'react'
import { OpenedLockIcon } from '@entur/icons'
import { LockModal } from '../../../../components/LockModal/LockModal'
import { MenuButton } from '../MenuButton/MenuButton'
import { useSettings } from '../../../../settings/SettingsProvider'

const LockButton = () => {
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
