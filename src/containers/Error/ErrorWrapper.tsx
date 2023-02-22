import React from 'react'
import { Theme } from 'src/types'
import { isDarkOrDefaultTheme } from 'utils/utils'
import { PrimaryButton } from '@entur/button'
import { Heading1 } from '@entur/typography'
import { ThemeContrastWrapper } from '../ThemeContrastWrapper/ThemeContrastWrapper'
import classes from './ErrorWrapper.module.scss'

function ErrorWrapper({
    title,
    message,
    image,
    callbackMessage,
    callback,
    altText,
    theme = Theme.DEFAULT,
}: {
    title: string
    message: string
    image: string
    callbackMessage?: string
    altText?: string
    callback?: (event: React.SyntheticEvent<HTMLButtonElement>) => void
    theme?: Theme
}) {
    return (
        <ThemeContrastWrapper useContrast={isDarkOrDefaultTheme(theme)}>
            <div className={classes.ErrorWrapper}>
                <img
                    className={classes.StyleImage}
                    src={`${image}`}
                    alt={altText}
                />
                <Heading1 className={classes.Heading} margin="both">
                    {title}
                </Heading1>
                <div className={classes.MainText}>{message}</div>
                {callback && (
                    <PrimaryButton
                        size="medium"
                        onClick={callback}
                        className={classes.PrimaryButton}
                    >
                        {callbackMessage}
                    </PrimaryButton>
                )}
            </div>
        </ThemeContrastWrapper>
    )
}

export { ErrorWrapper }
