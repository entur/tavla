import React, { useState, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import classNames from 'classnames'
import { useSettings } from '../../../settings/SettingsProvider'
import { LockModal } from '../../../components/LockModal/LockModal'
import classes from './LockAndViewButtons.module.scss'

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
            <div className={classes.FloatingButtons}>
                {showLockButton && (
                    <button
                        className={classes.Button}
                        onClick={(): void => setLockModalOpen(true)}
                    >
                        Lås tavle til konto
                    </button>
                )}
                <button
                    className={classNames(
                        classes.Button,
                        classes.Button_primary,
                    )}
                    onClick={goToDash}
                >
                    Se avgangstavla
                </button>
            </div>
            <LockModal
                open={lockModalOpen}
                onDismiss={(): void => setLockModalOpen(false)}
            />
        </>
    )
}

export { LockAndViewButtons }
