import React, { useState, useEffect, useCallback } from 'react'
import cx from 'classnames'
import classes from './TypographyCarousel.module.scss'

function getQuoteClassNames(index: number, active: number): string {
    return cx(classes.Quote, {
        [classes.Active]: index === active,
        [classes.ActiveOut]:
            index + 1 === active || (active === 0 && index === 4),
    })
}

function TypographyCarousel(): JSX.Element {
    const [intervalId, setIntervalId] = useState<NodeJS.Timer | null>(null)
    // variable for retriggering the useEffect after pausing the carousel
    const [effectTrigger, setEffectTrigger] = useState<number>(0)
    const [quoteIndex, setQuoteIndex] = useState<number>(0)
    const quotes = [
        'Reiseveien hjem',
        'Der du bor',
        'Veien til jobb',
        'Store knutepunkter',
    ]

    useEffect(() => {
        const timeoutId = setInterval(
            () => setQuoteIndex((oldIndex) => (oldIndex + 1) % 4),
            4000,
        )
        setIntervalId(timeoutId)

        return () => {
            setIntervalId(null)
            clearInterval(timeoutId)
        }
    }, [effectTrigger])

    const handleClick = useCallback(() => {
        if (intervalId) {
            setIntervalId(null)
            clearInterval(intervalId)
        } else {
            setEffectTrigger((et) => et + 1)
        }
    }, [intervalId])

    return (
        <div
            className={classes.TypographyCarousel}
            tabIndex={0}
            onKeyDown={(event) => {
                if (event.code === 'Enter') {
                    handleClick()
                }
            }}
            onClick={handleClick}
        >
            {quotes.map((quote, index) => (
                <div
                    className={getQuoteClassNames(index, quoteIndex)}
                    key={quote}
                >
                    {quote}
                </div>
            ))}
        </div>
    )
}

export { TypographyCarousel }
