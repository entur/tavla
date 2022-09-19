import React, { useState, useCallback } from 'react'
import { useHistory } from 'react-router'

import { Button } from '@entur/button'

import { useSettingsContext } from '../../../settings'
import { getDocumentId } from '../../../utils'
import LockModal from '../../../components/Modals/LockModal'

import './styles.scss'

const LockAndViewButtons = (): JSX.Element => {
    const history = useHistory()
    const [settings] = useSettingsContext()
    const documentId = getDocumentId()

    const owners = settings?.owners

    const [lockModalOpen, setLockModalOpen] = useState<boolean>(false)

    const goToDash = useCallback(() => {
        if (documentId) {
            history.push(window.location.pathname.replace('admin', 't'))
        }
        history.push(window.location.pathname.replace('admin', 'dashboard'))
    }, [history, documentId])

    const showLockButton = !owners?.length && documentId

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

export default LockAndViewButtons
