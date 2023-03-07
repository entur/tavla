import React, { useCallback, useState } from 'react'
import type { User } from 'firebase/auth'
import { LoginCase, ModalType } from 'src/types'
import { Modal } from '@entur/modal'
import classes from '../Modals.module.scss'
import { EmailLogin } from './EmailLogin'
import { LoginOptions } from './LoginOptions'
import { Signup } from './Signup'
import { ResetPassword } from './ResetPassword'
import { EmailSent } from './EmailSent'

function LoginModal({
    open,
    onDismiss,
    loginCase,
}: {
    open: boolean
    onDismiss: (user?: User) => void
    loginCase: LoginCase
}) {
    const [modalType, setModalType] = useState<ModalType>(
        ModalType.LoginOptionsModal,
    )

    const handleDismiss = useCallback(() => {
        setModalType(ModalType.LoginOptionsModal)
        onDismiss()
    }, [setModalType, onDismiss])

    return (
        <Modal
            onDismiss={handleDismiss}
            open={open}
            size="small"
            title=""
            className={classes.Modal}
        >
            {modalType === ModalType.LoginOptionsModal && (
                <LoginOptions
                    setModalType={setModalType}
                    onDismiss={onDismiss}
                    loginCase={loginCase}
                />
            )}
            {modalType === ModalType.EmailSentModal && (
                <EmailSent setModalType={setModalType} onDismiss={onDismiss} />
            )}
            {modalType === ModalType.ResetPasswordModal && (
                <ResetPassword
                    setModalType={setModalType}
                    onDismiss={onDismiss}
                />
            )}
            {modalType === ModalType.SignupModal && (
                <Signup setModalType={setModalType} onDismiss={onDismiss} />
            )}
            {modalType === ModalType.LoginEmailModal && (
                <EmailLogin setModalType={setModalType} onDismiss={onDismiss} />
            )}
        </Modal>
    )
}

export { LoginModal }
