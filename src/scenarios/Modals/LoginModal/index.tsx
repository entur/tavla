import React, { useCallback, useEffect, useState } from 'react'
import type { User } from 'firebase/auth'
import { useUser } from 'settings/UserProvider'
import { usePrevious } from 'hooks/usePrevious'
import { useToast } from '@entur/alert'
import { Modal } from '@entur/modal'
import classes from '../Modals.module.scss'
import { EmailLogin } from './EmailLogin'
import { LoginOptions } from './LoginOptions'
import { Signup } from './Signup'
import { ResetPassword } from './ResetPassword'
import { EmailSent } from './EmailSent'
import { LoginCase, ModalType } from './login-modal-types'

function LoginModal({
    open,
    onDismiss,
    loginCase,
}: {
    open: boolean
    onDismiss: (user?: User) => void
    loginCase: LoginCase
}) {
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
