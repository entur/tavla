import React, { useState, useEffect } from 'react'
import cx from 'classnames'

import './styles.scss'

function getQuoteClassNames(index: number, active: number): string {
    return cx('typography-carousel__quote', {
        'typography-carousel__quote--active': index === active,
        'typography-carousel__quote--active-out':
            index + 1 === active || (active === 0 && index === 4),
    })
}

function TypographyCarousel(): JSX.Element {
    const [quoteIndex, setQuoteIndex] = useState<number>(-1)
    const quotes = [
        'Reiseveien hjem',
        'Der du bor',
        'Veien til jobb',
        'Store knutepunkter',
    ]

    useEffect(() => {
        const timeoutId = setInterval(
            () => setQuoteIndex((quoteIndex + 1) % 5),
            quoteIndex === -1 ? 0 : 4000,
        )

        return (): void => clearInterval(timeoutId)
    }, [quoteIndex])

    return (
        <div className="typography-carousel">
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

export default TypographyCarousel
