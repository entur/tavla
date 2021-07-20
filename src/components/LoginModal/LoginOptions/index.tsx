import React, { Dispatch, SetStateAction } from 'react'

import { Heading3, Paragraph } from '@entur/typography'
import { GridContainer, GridItem } from '@entur/grid'
import { PrimaryButton, SecondaryButton } from '@entur/button'

import { ModalType, LoginCase } from '..'

import sikkerhetBom from '../../../assets/images/sikkerhet_bom.png'
import retinaSikkerhetBom from '../../../assets/images/sikkerhet_bom@2x.png'

interface Props {
    setModalType: Dispatch<SetStateAction<ModalType>>
    loginCase: LoginCase
}

const description = (loginCase: LoginCase): string => {
    switch (loginCase) {
        case 'mytables':
            return 'For å se oversikten over dine tavler, må du være innlogget.'
        case 'lock':
            return 'For å låse tavlas redigeringsrettigheter til en konto, må du være innlogget.'
        case 'logo':
            return 'For å laste opp logo og beskrivelse på avgangstavla, må du ha en konto.'
        case 'error':
            return 'For å redigere denne tavla, må du først logge inn på kontoen den tilhører.'
        default:
            return 'Logg inn for å få tilgang på ekstra funksjonalitet, som å se dine tavler eller last opp logo.'
    }
}

const LoginOptions = ({ setModalType, loginCase }: Props): JSX.Element => (
    <div>
        <div className="centered">
            <img src={sikkerhetBom} srcSet={`${retinaSikkerhetBom} 2x`} />
        </div>
        <Heading3 margin="bottom">Logg inn for å fortsette</Heading3>
        <Paragraph style={{ textAlign: 'center' }}>
            {description(loginCase)}
        </Paragraph>
        <GridContainer spacing="small">
            <GridItem small={12}>
                <PrimaryButton
                    width="fluid"
                    onClick={(): void => setModalType('LoginEmailModal')}
                >
                    Logg inn med e-post
                </PrimaryButton>
            </GridItem>
            <GridItem small={12}>
                <SecondaryButton
                    width="fluid"
                    onClick={(): void => setModalType('SignupModal')}
                >
                    Lag en ny konto
                </SecondaryButton>
            </GridItem>
        </GridContainer>
    </div>
)

export default LoginOptions
