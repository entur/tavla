import React, { Dispatch, SetStateAction, useCallback } from 'react'
import sikkerhetBom from 'assets/images/sikkerhet_bom.png'
import retinaSikkerhetBom from 'assets/images/sikkerhet_bom@2x.png'
import { Heading3, Paragraph } from '@entur/typography'
import { GridContainer, GridItem } from '@entur/grid'
import { PrimaryButton, SecondaryButton } from '@entur/button'
import { CloseButton } from '../../../CloseButton/CloseButton'
import { LoginCase, ModalType } from '../login-modal-types'
import classes from '../../AccountModals.module.scss'

const description: Record<LoginCase, string> = {
    [LoginCase.mytables]:
        'For å se oversikten over dine tavler, må du være innlogget.',
    [LoginCase.lock]:
        'For å låse tavlas redigeringsrettigheter til en konto, må du være innlogget.',
    [LoginCase.logo]:
        'For å laste opp logo og beskrivelse på avgangstavla, må du ha en konto.',
    [LoginCase.link]:
        'For å sette en personlig Tavla-lenke til avgangstavla, må du ha en konto.',
    [LoginCase.error]:
        'For å redigere denne tavla, må du først logge inn på kontoen den tilhører.',
    [LoginCase.share]:
        'For å dele en tavle med andre, må du eie den og være logget inn.',
    [LoginCase.default]:
        'Logg inn for å få tilgang på ekstra funksjonalitet, som å se dine tavler eller last opp logo.',
}

function LoginOptions({
    setModalType,
    loginCase,
    onDismiss,
}: {
    setModalType: Dispatch<SetStateAction<ModalType>>
    loginCase: LoginCase
    onDismiss: () => void
}) {
    const handleDismiss = useCallback(() => {
        setModalType(ModalType.LoginOptionsModal)
        onDismiss()
    }, [setModalType, onDismiss])

    return (
        <>
            <CloseButton onClick={handleDismiss} />
            <div>
                <img
                    src={sikkerhetBom}
                    srcSet={`${retinaSikkerhetBom} 2x`}
                    className={classes.Image}
                />
                <Heading3 margin="bottom">Logg inn for å fortsette</Heading3>
                <Paragraph className={classes.Paragraph}>
                    {description[loginCase]}
                </Paragraph>
                <GridContainer
                    spacing="small"
                    className={classes.GridContainer}
                >
                    <GridItem small={12}>
                        <PrimaryButton
                            width="fluid"
                            onClick={(): void =>
                                setModalType(ModalType.LoginEmailModal)
                            }
                        >
                            Logg inn med e-post
                        </PrimaryButton>
                    </GridItem>
                    <GridItem small={12}>
                        <SecondaryButton
                            width="fluid"
                            onClick={(): void =>
                                setModalType(ModalType.SignupModal)
                            }
                        >
                            Lag en ny konto
                        </SecondaryButton>
                    </GridItem>
                </GridContainer>
            </div>
        </>
    )
}

export { LoginOptions }
