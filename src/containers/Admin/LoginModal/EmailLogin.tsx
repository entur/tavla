import React, { useState } from 'react'
import firebase from 'firebase'

import { TextField, InputGroup } from '@entur/form'
import { GridContainer, GridItem } from '@entur/grid'
import { EmailIcon, ClosedLockIcon } from '@entur/icons'
import { PrimaryButton } from '@entur/button'
import { Heading2, Link } from '@entur/typography'

interface User {
    email: string
    password: string
}

function useFormFields<T>(
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

    const signIn = (
        email: string,
        password: string,
    ): Promise<void | firebase.auth.UserCredential> =>
        firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .catch(function(error) {
                // Handle Errors here.
                const errorCode = error.code
                const errorMessage = error.message
                if (errorCode === 'auth/wrong-password') {
                    alert('Wrong password.')
                } else {
                    alert(errorMessage)
                }
                console.log(error)
            })

    const handleSubmit = (event: React.FormEvent): void => {
        event.preventDefault()
        console.log(inputs)
        signIn(inputs.email, inputs.password)
    }

    return (
        <div>
            <Heading2 style={{ textAlign: 'center' }} margin="none">
                Logg inn med e-post
            </Heading2>
            <form>
                <GridContainer spacing="small" style={{ padding: '10%' }}>
                    <GridItem small={12}>
                        <InputGroup label="E-post">
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
                        <InputGroup label="Passord">
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
            <Link style={{}}>Jeg har glemt passord</Link>
        </div>
    )
}

export default EmailLogin
