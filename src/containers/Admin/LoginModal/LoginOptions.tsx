import React, { useState } from 'react'

import { Heading2, Paragraph } from '@entur/typography'
import { GridContainer, GridItem } from '@entur/grid'
import { PrimaryButton, SecondaryButton } from '@entur/button'

interface User {
    email: string
    password: string
}

const LoginOptions = () => {

    handleOnClick = () => {
        if (event.target.id == "login")

    }

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
                    <PrimaryButton width="fluid" id="login">
                        Logg inn med e-post
                    </PrimaryButton>
                    <SecondaryButton width="fluid" id="signup" onClick={handleOnClick}>
                        Lag en ny konto
                    </SecondaryButton>
                </GridItem>
            </GridContainer>
        </div>
    )
}

export default LoginOptions
