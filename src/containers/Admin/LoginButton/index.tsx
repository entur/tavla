import React, { useState, useEffect } from 'react'
import firebase from 'firebase'

import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import { Modal } from '@entur/modal'
import { TextField, InputGroup } from '@entur/form'
import { GridContainer, GridItem } from '@entur/grid'
import { EmailIcon, ClosedLockIcon } from '@entur/icons'
import { PrimaryButton } from '@entur/button'
import { Paragraph, Heading2, Link } from '@entur/typography'

import { useIsFirebaseInitialized } from '../../../firebase-init'
import { useFirebaseAuthentication } from '../../../auth'

import sikkerhetBom from '../../../assets/images/sikkerhet_bom.png'
import retinaSikkerhetBom from '../../../assets/images/sikkerhet_bom@2x.png'

const uiConfig = {
    signInFlow: 'popup',
    autoUpgradeAnonymousUsers: true,
    credentialHelper: 'none',

    signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    ],

    callbacks: {
        signInSuccessWithAuthResult: () => false,

        /*
        signInFailure: (error: firebaseui.auth.AuthUIError) => {
            if (error.code != 'firebaseui/anonymous-upgrade-merge-conflict') {
                return Promise.resolve()
            }

            return firebase.auth().signInWithCredential(error.credential)
        },*/
    },
}

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

const LoginButton = () => {
    const [modalOpen, setModalOpen] = useState(false)

    const isFirebaseInitialized = useIsFirebaseInitialized()

    const user = useFirebaseAuthentication()

    //const [email, setEmail] = useState()

    //const [password, setPassword] = useState()

    //const FormProps = () => {
    const [inputs, handleInputsChange] = useFormFields<User>({
        email: '',
        password: '',
    })
    //}

    const isLoggedIn = user && !user.isAnonymous

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

    useEffect(() => {
        if (isLoggedIn && modalOpen) {
            setModalOpen(false)
        }
    }, [isLoggedIn, modalOpen])

    const handleSubmit = (event: React.FormEvent): void => {
        event.preventDefault()
        console.log(inputs)
        signIn(inputs.email, inputs.password)
    }

    if (!isFirebaseInitialized) return null

    if (modalOpen) {
        return (
            <Modal onDismiss={() => setModalOpen(false)} size="small" title="">
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <img
                        src={sikkerhetBom}
                        srcSet={`${retinaSikkerhetBom} 2x`}
                        style={{ width: '45%', margin: '0 auto' }}
                    />
                </div>
                <Heading2 style={{ textAlign: 'center' }} margin="none">
                    Logg inn med e-post
                </Heading2>
                <form>
                    <GridContainer spacing="small" style={{ padding: '10%' }}>
                        {/* <GridItem small={12}>
                            <Paragraph>
                                For å låse tavlas redigeringsrettigheter til en
                                konto, må du være innlogget.
                            </Paragraph>
                        </GridItem> */}
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
                {/* <StyledFirebaseAuth
                    uiConfig={uiConfig}
                    firebaseAuth={firebase.auth()}
                /> */}
            </Modal>
        )
    }

    return isLoggedIn ? (
        <a onClick={() => firebase.auth().signOut()}>Sign-out</a>
    ) : (
        <a onClick={() => setModalOpen(true)}>Logg inn</a>
    )
}

export default LoginButton
