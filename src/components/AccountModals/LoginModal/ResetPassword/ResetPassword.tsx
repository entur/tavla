import React, { Dispatch, SetStateAction, useState } from 'react'
import type { User } from 'firebase/auth'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from 'settings/UserProvider'
import sikkerhetBom from 'assets/images/sikkerhet_bom.png'
import retinaSikkerhetBom from 'assets/images/sikkerhet_bom@2x.png'
import { useFormFields } from 'hooks/useFormFields'
import { TextField } from '@entur/form'
import { GridContainer, GridItem } from '@entur/grid'
import { BackArrowIcon, EmailIcon } from '@entur/icons'
import { PrimaryButton } from '@entur/button'
import { Heading3, Paragraph } from '@entur/typography'
import { CloseButton } from '../../../CloseButton/CloseButton'
import { ModalType } from '../login-modal-types'
import classes from '../../AccountModals.module.scss'

function ResetPassword({
    setModalType,
    onDismiss,
}: {
    setModalType: Dispatch<SetStateAction<ModalType>>
    onDismiss: (user?: User) => void
}) {
    const [inputs, handleInputsChange] = useFormFields<{
        email: string
    }>({
        email: '',
    })

    const [emailError, setEmailError] = useState<string>()

    const handleReset = (): void => {
        const actionCodeSettings = {
            url: window.location.href,
        }

        sendPasswordResetEmail(auth, inputs.email, actionCodeSettings)
            .then(() => {
                setModalType(ModalType.EmailSentModal)
            })
            .catch((error) => {
                if (error.code === 'auth/invalid-email') {
                    setEmailError('E-posten er ikke gyldig')
                } else if (error.code === 'auth/user-not-found') {
                    setEmailError('Vi finner ingen konto med denne e-posten.')
                } else if (error.code === 'auth/too-many-requests') {
                    setEmailError('For mange forsøk, prøv igjen senere.')
                }
            })
    }

    const handleClose = (): void => {
        setModalType(ModalType.LoginOptionsModal)
        onDismiss()
    }

    return (
        <>
            <div className={classes.ModalHeader}>
                <BackArrowIcon
                    size={30}
                    onClick={(): void =>
                        setModalType(ModalType.LoginEmailModal)
                    }
                    className={classes.BackButton}
                />
                <CloseButton onClick={handleClose} />
            </div>
            <img
                src={sikkerhetBom}
                srcSet={`${retinaSikkerhetBom} 2x`}
                className={classes.Image}
            />
            <Heading3 margin="none">Glemt passord</Heading3>
            <Paragraph className={classes.Paragraph}>
                Skriv inn e-postadressen som du registrerte profilen din på, så
                sender vi deg en lenke der du kan lage et nytt passord.
            </Paragraph>
            <GridContainer spacing="medium" className={classes.GridContainer}>
                <GridItem small={12}>
                    <TextField
                        label="E-post"
                        variant={emailError ? 'error' : undefined}
                        feedback={emailError}
                        type="text"
                        value={inputs.email}
                        onChange={handleInputsChange}
                        id="email"
                        prepend={<EmailIcon inline />}
                        placeholder="F.eks. ola.nordmann@entur.no"
                    />
                </GridItem>
                <GridItem small={12}>
                    <PrimaryButton
                        width="fluid"
                        type="button"
                        onClick={handleReset}
                        className={classes.ModalSubmit}
                    >
                        Send nytt passord
                    </PrimaryButton>
                </GridItem>
            </GridContainer>
        </>
    )
}

export { ResetPassword }
