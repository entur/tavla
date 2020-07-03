import React, { Dispatch, SetStateAction } from 'react'

import { Heading2, Paragraph } from '@entur/typography'
import { GridContainer, GridItem } from '@entur/grid'
import { PrimaryButton, SecondaryButton } from '@entur/button'
import { ModalType } from '..'

import sikkerhetBom from '../../../../assets/images/sikkerhet_bom.png'
import retinaSikkerhetBom from '../../../../assets/images/sikkerhet_bom@2x.png'

interface Props {
    setModalType: Dispatch<SetStateAction<ModalType>>
}

const LoginOptions = ({ setModalType }: Props): JSX.Element => {
    return (
        <div>
            <div className="centered">
                <img src={sikkerhetBom} srcSet={`${retinaSikkerhetBom} 2x`} />
            </div>
            <Heading2 margin="bottom">Logg inn for å fortsette</Heading2>
            <Paragraph style={{ textAlign: 'center' }}>
                For å låse tavlas redigeringsrettigheter til en konto, må du
                være innlogget.
            </Paragraph>
            <GridContainer spacing="small">
                <GridItem small={12}>
                    <PrimaryButton
                        width="fluid"
                        onClick={() => setModalType('LoginEmailModal')}
                    >
                        Logg inn med e-post
                    </PrimaryButton>
                </GridItem>
                <GridItem small={12}>
                    <SecondaryButton
                        width="fluid"
                        onClick={() => setModalType('SignupModal')}
                    >
                        Lag en ny konto
                    </SecondaryButton>
                </GridItem>
            </GridContainer>
        </div>
    )
}

export default LoginOptions
