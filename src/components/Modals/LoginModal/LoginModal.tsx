import React, { useState, useEffect } from 'react'
import type { User } from 'firebase/auth'
import { useToast } from '@entur/alert'
import { Modal } from '@entur/modal'
import { useUser } from '../../../auth'
import { usePrevious } from '../../../utils'
import { EmailLogin } from './EmailLogin/EmailLogin'
import { LoginOptions } from './LoginOptions/LoginOptions'
import { Signup } from './Signup/Signup'
import { ResetPassword } from './ResetPassword/ResetPassword'
import { EmailSent } from './EmailSent/EmailSent'
import { CloseButton } from './CloseButton/CloseButton'
import './LoginModal.scss'

export type LoginCase =
    | 'lock'
    | 'mytables'
    | 'logo'
    | 'link'
    | 'share'
    | 'error'
    | 'default'

interface Props {
    open: boolean
    onDismiss: (user?: User) => void
    loginCase: LoginCase
}

export type ModalType =
    | 'LoginOptionsModal'
    | 'LoginEmailModal'
    | 'SignupModal'
    | 'ResetPasswordModal'
    | 'EmailSentModal'

const LoginModal = ({ open, onDismiss, loginCase }: Props): JSX.Element => {
    const user = useUser()

    const isLoggedIn = user && !user.isAnonymous

    const { addToast } = useToast()

    const [modalType, setModalType] = useState<ModalType>('LoginOptionsModal')

    const displayModal = (): JSX.Element => {
        switch (modalType) {
            case 'LoginEmailModal':
                return (
                    <EmailLogin
                        setModalType={setModalType}
                        onDismiss={onDismiss}
                    />
                )
            case 'SignupModal':
                return (
                    <Signup setModalType={setModalType} onDismiss={onDismiss} />
                )
            case 'ResetPasswordModal':
                return (
                    <ResetPassword
                        setModalType={setModalType}
                        onDismiss={onDismiss}
                    />
                )
            case 'EmailSentModal':
                return (
                    <EmailSent
                        setModalType={setModalType}
                        onDismiss={onDismiss}
                    />
                )
            default:
                return (
                    <LoginOptions
                        setModalType={setModalType}
                        loginCase={loginCase}
                    />
                )
        }
    }

    const prevIsLoggedIn = usePrevious(isLoggedIn)

    useEffect(() => {
        if (user && isLoggedIn && !prevIsLoggedIn && open) {
            setModalType('LoginOptionsModal')
            addToast({
                title: 'Logget inn',
                content: 'Du har nå logget inn på din konto.',
                variant: 'success',
            })
            onDismiss(user)
        }
    }, [isLoggedIn, open, onDismiss, addToast, prevIsLoggedIn, user])

    const handleDismiss = (): void => {
        setModalType('LoginOptionsModal')
        onDismiss()
    }

    const closeButton = modalType === 'LoginOptionsModal' && (
        <CloseButton onClick={handleDismiss} />
    )

    return (
        <Modal
            onDismiss={handleDismiss}
            open={open}
            size="small"
            title=""
            className="login-modal"
        >
            {closeButton}
            {displayModal()}
        </Modal>
    )
}

export { LoginModal }
