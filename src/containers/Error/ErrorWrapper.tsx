import React from 'react'
import { PrimaryButton } from '@entur/button'
import { Heading1 } from '@entur/typography'
import { Theme } from '../../types'
import { ThemeContrastWrapper } from '../ThemeContrastWrapper/ThemeContrastWrapper'
import { isDarkOrDefaultTheme } from '../../utils/utils'
import './ErrorWrapper.scss'

interface ErrorWrapperProps {
    title: string
    message: string
    image: string
    callbackMessage?: string
    altText?: string
    callback?: (event: React.SyntheticEvent<HTMLButtonElement>) => void
    theme?: Theme
}

function ErrorWrapper({
    title,
    message,
    image,
    callbackMessage,
    callback,
    altText,
    theme = Theme.DEFAULT,
}: ErrorWrapperProps): JSX.Element {
    return (
        <ThemeContrastWrapper useContrast={isDarkOrDefaultTheme(theme)}>
            <div className="error-wrapper">
                <img className="style-image" src={`${image}`} alt={altText} />
                <Heading1 className="heading" margin="both">
                    {title}
                </Heading1>
                <div className="main-text">{message}</div>
                {callback && (
                    <PrimaryButton
                        size="medium"
                        onClick={callback}
                        className="primary-button"
                    >
                        {callbackMessage}
                    </PrimaryButton>
                )}
            </div>
        </ThemeContrastWrapper>
    )
}

export { ErrorWrapper }
