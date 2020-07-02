import React, { useState, Dispatch, SetStateAction } from 'react'

import { Heading2, Paragraph } from '@entur/typography'
import { GridContainer, GridItem } from '@entur/grid'
import { PrimaryButton, SecondaryButton } from '@entur/button'
import { ModalType } from '.'

interface Props {
    setModalType: Dispatch<SetStateAction<ModalType>>
}

const LoginOptions = ({ setModalType }: Props): JSX.Element => {
    return (
        <div>
            <Heading2 style={{ textAlign: 'center' }} margin="bottom">
                Logg inn for å fortsette
            </Heading2>
            <Paragraph style={{ textAlign: 'center' }}>
                For å låse tavlas redigeringsrettigheter til en konto, må du
                være innlogget.
            </Paragraph>
            <GridContainer spacing="small" style={{ padding: '10%' }}>
                <GridItem small={12}>
                    <PrimaryButton width="fluid" onClick={() => setModalType('LoginEmailModal')}>
                        Logg inn med e-post
                    </PrimaryButton>
                </GridItem>
                <GridItem small={12}>
                    <SecondaryButton width="fluid" onClick={() => setModalType('SignupModal')}>
                        Lag en ny konto
                    </SecondaryButton>
                </GridItem>
            </GridContainer>
        </div>
    )
}

export default LoginOptions
