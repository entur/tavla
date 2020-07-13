import React, { useCallback } from 'react'

import './styles.scss'
import { Heading3, Paragraph } from '@entur/typography'
import { RadioBox } from './RadioBox'

function RadioCard({
    title,
    description,
    cardValue,
    selected,
    preview,
    callback,
}: Props): JSX.Element {
    const sendChoice = useCallback(() => {
        event.preventDefault()
        callback(cardValue)
    }, [cardValue, callback])

    return (
        <div
            className={`radio-card ${selected ? 'selected' : ''}`}
            onClick={sendChoice}
        >
            <img className="preview" src={preview} />
            <div className="radio-container">
                <div className="header-wrapper">
                    <RadioBox className="radio-element" selected={selected} />
                    <Heading3 className="title" margin="none">
                        {title}
                    </Heading3>
                </div>
                <Paragraph className="description">{description}</Paragraph>
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
}

export default RadioCard
