import React, { useCallback } from 'react'
import classNames from 'classnames'
import { Heading3, Paragraph } from '@entur/typography'
import { ValidationCheck } from '../../assets/icons/ValidationCheck'
import classes from './RadioCard.module.scss'

interface RadioCardProps<T> {
    title: string
    preview: string
    value: T
    selected: boolean
    description?: string
    onChange: (value: T) => void
    className?: string
    altText?: string
}

function RadioCard<T>({
    title,
    description,
    value,
    selected,
    preview,
    onChange,
    className,
    altText,
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
                classes.RadioCard,
                {
                    [classes.Selected]: selected,
                },
                className,
            )}
            onClick={handleClick}
        >
            <img className={classes.Preview} src={preview} alt={altText} />
            <div className={classes.RadioContainer}>
                <div className={classes.HeaderWrapper}>
                    <div
                        className={classNames(classes.Radio, {
                            [classes.Checked]: selected,
                        })}
                    >
                        {selected ? <ValidationCheck /> : null}
                    </div>
                    <Heading3 className={classes.Title} margin="none">
                        {title}
                    </Heading3>
                </div>
                <Paragraph className={classes.Description}>
                    {description}
                </Paragraph>
            </div>
        </div>
    )
}

export { RadioCard }
