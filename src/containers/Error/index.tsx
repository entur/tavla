import React from 'react'

import { PrimaryButton } from '@entur/button'

import './styles.scss'
import { Contrast } from '@entur/layout'
import { Heading1 } from '@entur/typography'

function ErrorWrapper({
    title,
    message,
    image,
    callbackMessage,
    callback,
}: Props): JSX.Element {
    const errorCallback = callback ? (
        <PrimaryButton
            size="medium"
            onClick={callback}
            className="primary-button"
        >
            {callbackMessage}
        </PrimaryButton>
    ) : null

    return (
        // Div under er Contrast
        <div className="error-wrapper">
            <img className="style-image" src={`${image}`} />
            <Heading1 margin="both">{title}</Heading1>
            <div className="main-text">{message}</div>
            {errorCallback}
        </div>
    )
}

interface Props {
    title: string
    message: string
    image: any
    callbackMessage?: string
    callback?: (event: React.SyntheticEvent<HTMLButtonElement>) => void
}

export default ErrorWrapper
