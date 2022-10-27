import React, { useCallback, useEffect, useState } from 'react'
import type { User } from 'firebase/auth'
import { useToast } from '@entur/alert'
import { Modal } from '@entur/modal'
import { useUser } from '../../UserProvider'
import { usePrevious } from '../../hooks/usePrevious'
import { EmailLogin } from './EmailLogin/EmailLogin'
import { LoginOptions } from './LoginOptions/LoginOptions'
import { Signup } from './Signup/Signup'
import { ResetPassword } from './ResetPassword/ResetPassword'
import { EmailSent } from './EmailSent/EmailSent'
import './LoginModal.scss'
import { LoginCase, ModalType } from './login-modal-types'

interface LoginModalProps {
    open: boolean
    onDismiss: (user?: User) => void
    loginCase: LoginCase
}

const LoginModal: React.FC<LoginModalProps> = ({
    open,
    onDismiss,
    loginCase,
}) => {
    const user = useUser()
    const { addToast } = useToast()
    const [modalType, setModalType] = useState<ModalType>(
        ModalType.LoginOptionsModal,
    )

    const isLoggedIn = user && !user.isAnonymous
    const prevIsLoggedIn = usePrevious(isLoggedIn)

    useEffect(() => {
        if (user && isLoggedIn && !prevIsLoggedIn && open) {
            setModalType(ModalType.LoginOptionsModal)
            addToast({
                title: 'Logget inn',
                content: 'Du har nå logget inn på din konto.',
                variant: 'success',
            })
            onDismiss(user)
        }
    }, [isLoggedIn, open, onDismiss, addToast, prevIsLoggedIn, user])

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
            className="login-modal"
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
