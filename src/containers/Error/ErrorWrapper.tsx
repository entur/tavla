import React from 'react'

import { PrimaryButton } from '@entur/button'
import { Heading1 } from '@entur/typography'

import { useSettingsContext } from '../../settings'
import { Theme } from '../../types'
import { ThemeContrastWrapper } from '../ThemeWrapper/ThemeContrastWrapper'

import './ErrorWrapper.scss'

function ErrorWrapper({
    title,
    message,
    image,
    callbackMessage,
    callback,
}: Props): JSX.Element {
    const [settings] = useSettingsContext()

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
        <ThemeContrastWrapper useContrast={settings?.theme === Theme.DEFAULT}>
            <div className="error-wrapper">
                <img className="style-image" src={`${image}`} />
                <Heading1 className="heading" margin="both">
                    {title}
                </Heading1>
                <div className="main-text">{message}</div>
                {errorCallback}
            </div>
        </ThemeContrastWrapper>
    )
}

interface Props {
    title: string
    message: string
    image: string
    callbackMessage?: string
    callback?: (event: React.SyntheticEvent<HTMLButtonElement>) => void
}

export { ErrorWrapper }
