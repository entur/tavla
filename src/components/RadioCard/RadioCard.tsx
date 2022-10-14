import React, { useCallback } from 'react'
import classNames from 'classnames'
import { Heading3, Paragraph } from '@entur/typography'
import { RadioBox } from './RadioBox/RadioBox'
import './RadioCard.scss'

interface RadioCardProps<T> {
    title: string
    preview: string
    value: T
    selected: boolean
    description?: string
    onChange: (value: T) => void
    className?: string
}

function RadioCard<T>({
    title,
    description,
    value,
    selected,
    preview,
    onChange,
    className,
}: RadioCardProps<T>): JSX.Element {
    const handleClick = useCallback(
        (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            event.preventDefault()
            onChange(value)
        },
        [value, onChange],
    )

    return (
        <div
            className={classNames(
                'radio-card',
                {
                    'radio-card__selected': selected,
                },
                className,
            )}
            onClick={handleClick}
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

export { RadioCard }
