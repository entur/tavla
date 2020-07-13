import React, { useEffect, useState } from 'react'

import { PrimaryButton } from '@entur/button'

import './styles.scss'
import { Heading1 } from '@entur/typography'
import ThemeContrastWrapper from '../ThemeWrapper/ThemeContrastWrapper'
import { useSettingsContext } from '../../settings'

function ErrorWrapper({
    title,
    message,
    image,
    callbackMessage,
    callback,
}: Props): JSX.Element {
    const [useContrastWrapper, setUseContrastWrapper] = useState<boolean>(true)
    const [settings] = useSettingsContext()

    useEffect(() => {
        if (settings) {
            if (settings.theme === 'default') {
                setUseContrastWrapper(true)
            } else {
                setUseContrastWrapper(false)
            }
        }
    }, [settings])

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
        <ThemeContrastWrapper useContrast={useContrastWrapper}>
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
    image: any
    callbackMessage?: string
    callback?: (event: React.SyntheticEvent<HTMLButtonElement>) => void
}

export default ErrorWrapper
