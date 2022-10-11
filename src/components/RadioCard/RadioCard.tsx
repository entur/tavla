import React, { useCallback } from 'react'

import { Heading3, Paragraph } from '@entur/typography'

import { RadioBox } from './RadioBox/RadioBox'

import './RadioCard.scss'

function RadioCard({
    title,
    description,
    cardValue,
    selected,
    preview,
    callback,
    className,
}: Props): JSX.Element {
    const sendChoice = useCallback(
        (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            event.preventDefault()
            if (callback) {
                callback(cardValue)
            }
        },
        [cardValue, callback],
    )

    return (
        <div
            className={`radio-card ${
                selected ? 'radio-card__selected' : ''
            } ${className}`}
            onClick={sendChoice}
        >
            <img className="radio-card__preview" src={preview} />
            <div className="radio-card__radio-container">
                <div className="radio-card__radio-container__header-wrapper">
                    <RadioBox
                        className="radio-card__radio-container__header-wrapper__radio-element"
                        selected={selected}
                    />
                    <Heading3
                        className="radio-card__radio-container__header-wrapper__title"
                        margin="none"
                    >
                        {title}
                    </Heading3>
                </div>
                <Paragraph className="radio-card__radio-container__description">
                    {description}
                </Paragraph>
            </div>
        </div>
    )
}

interface Props {
    title: string
    preview: string
    cardValue: string
    selected: boolean
    description?: string
    callback?: (value: string) => void
    className?: string
}

export { RadioCard }
