import React, { useState } from 'react'
import firebase from 'firebase'

import { TextField, InputGroup } from '@entur/form'
import { GridContainer, GridItem } from '@entur/grid'
import { EmailIcon, ClosedLockIcon } from '@entur/icons'
import { PrimaryButton } from '@entur/button'
import { Heading2, Link } from '@entur/typography'

export interface User {
    email: string
    password: string
}

export function useFormFields<T>(
    initialState: T,
): [
    T,
    (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void,
] {
    const [inputs, setValues] = useState<T>(initialState)

    return [
        inputs,
        function(
            event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
        ): void {
            setValues({
                ...inputs,
                [event.target.id]: event.target.value,
            })
        },
    ]
}

const EmailLogin = () => {
    const [inputs, handleInputsChange] = useFormFields<User>({
        email: '',
        password: '',
    })

    const [emailError, setEmailError] = useState<string>()
    const [passwordError, setPasswordError] = useState<string>()

    const signIn = (email: string, password: string): void => {
        setEmailError(undefined)
        setPasswordError(undefined)

        firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .catch(function(error) {
                if (error.code === 'auth/invalid-email') {
                    setEmailError('E-posten er ikke gyldig')
                } else if (error.code === 'auth/user-disabled') {
                    setEmailError('Brukeren er deaktivert.')
                } else if (error.code === 'auth/user-not-found') {
                    setEmailError('Vi finner ingen konto med denne e-posten.')
                } else if (error.code === 'auth/wrong-password') {
                    setPasswordError('Feil passord.')
                } else if (error.code === 'auth/too-many-requests') {
                    setPasswordError('For mange innloggingsforsøk, prøv igjen senere.')
                } else {
                    console.error(error)
                }
            })
    }

    const handleSubmit = (event: React.FormEvent): void => {
        event.preventDefault()
        console.log(inputs)
        signIn(inputs.email, inputs.password)
    }

    const handleReset = () => {
        firebase.auth().sendPasswordResetEmail(inputs.email).then(function() {
          // Email sent.
        }).catch(function(error) {
          alert(error + ':((((((')
        });    
    }

    return (
        <>
            <Heading2 style={{ textAlign: 'center' }} margin="none">
                Logg inn med e-post
            </Heading2>
            <form>
                <GridContainer spacing="small" style={{ padding: '10%' }}>
                    <GridItem small={12}>
                        <InputGroup
                            label="E-post"
                            variant={emailError ? 'error' : undefined}
                            feedback={emailError}
                        >
                            <TextField
                                type="text"
                                value={inputs.email}
                                onChange={handleInputsChange}
                                id="email"
                                prepend={<EmailIcon inline />}
                            />
                        </InputGroup>
                    </GridItem>
                    <GridItem small={12}>
                        <InputGroup
                            label="Passord"
                            variant={passwordError ? 'error' : undefined}
                            feedback={passwordError}
                        >
                            <TextField
                                type="password"
                                value={inputs.password}
                                onChange={handleInputsChange}
                                id="password"
                                prepend={<ClosedLockIcon inline />}
                            />
                        </InputGroup>
                    </GridItem>
                    <GridItem small={12}>
                        <PrimaryButton
                            width="fluid"
                            type="submit"
                            onClick={handleSubmit}
                        >
                            Logg inn
                        </PrimaryButton>
                    </GridItem>
                </GridContainer>
            </form>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Link onClick={handleReset}>Jeg har glemt passord</Link>    
            </div> 
        </>
    )
}

export default EmailLogin
