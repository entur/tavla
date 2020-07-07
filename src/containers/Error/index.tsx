import React from 'react'

import { PrimaryButton } from '@entur/button'

import './styles.scss'
import { Contrast } from '@entur/layout'

function ErrorWrapper({
    title,
    message,
    image,
    callbackMessage,
    callback,
}: Props): JSX.Element {
    return (
        <Contrast className="error-wrapper">
            <img className="style-image" src={`${image}`} />
            <h1>{title}</h1>
            <div className="main-text">{message}</div>
            <PrimaryButton
                size="medium"
                width="fluid"
                onClick={callback}
                className="center primary-button"
            >
                {callbackMessage}
            </PrimaryButton>
        </Contrast>
    )
}

interface Props {
    title: string
    message: string
    image: any
    callbackMessage?: string
    callback?: (event: React.SyntheticEvent<HTMLButtonElement>) => void
    history: any
}

export default ErrorWrapper
