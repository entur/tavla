import React, { useState, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@entur/button'
import { useSettings } from '../../../settings/SettingsProvider'
import { LockModal } from '../../../components/LockModal/LockModal'
import './LockAndViewButtons.scss'

const LockAndViewButtons = (): JSX.Element => {
    const navigate = useNavigate()
    const [settings] = useSettings()
    const { documentId } = useParams<{ documentId: string }>()

    const [lockModalOpen, setLockModalOpen] = useState<boolean>(false)

    const goToDash = useCallback(() => {
        if (documentId) {
            navigate(window.location.pathname.replace('admin', 't'))
        }
        navigate(window.location.pathname.replace('admin', 'dashboard'))
    }, [navigate, documentId])

    const showLockButton = !settings.owners.length && documentId

    return (
        <>
            <div className="admin__floating-buttons">
                {showLockButton && (
                    <Button
                        variant="secondary"
                        onClick={(): void => setLockModalOpen(true)}
                    >
                        Lås tavle til konto
                    </Button>
                )}
                <Button variant="primary" onClick={goToDash}>
                    Se avgangstavla
                </Button>
            </div>
            <LockModal
                open={lockModalOpen}
                onDismiss={(): void => setLockModalOpen(false)}
            />
        </>
    )
}

export { LockAndViewButtons }
