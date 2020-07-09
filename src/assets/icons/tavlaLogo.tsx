import React from 'react'
import { colors } from '@entur/tokens'

function TavlaLogo({ className, theme = 'dark', height }: Props): JSX.Element {
    const fillColor = theme === 'dark' ? 'white' : colors.brand.blue
    return (
        <svg
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 300 54"
            height={height}
        >
            <g fill="none" fillRule="evenodd">
                <path
                    fill={fillColor}
                    d="M5.6,5v7.4h14.2v5H5.6v7.2h16v5H0V0h21.6v5H5.6z"
                />
                <path
                    fill={colors.brand.coral}
                    d="M52.1,42.2H0v-5h52.1V42.2z"
                />
                <path
                    fill={fillColor}
                    d="M51.6,29.7L32.3,12.1v17.7h-5.6V0h0.6l19.3,18V0h5.6v29.7H51.6z"
                />
                <path
                    fill={fillColor}
                    d="M79.8,17.5h-8.4v24.7h-5.6V17.5h-8.4v-5h22.4L79.8,17.5L79.8,17.5z"
                />
                <path
                    fill={fillColor}
                    // eslint-disable-next-line max-len
                    d="M96.6,42.8c-1.9,0-3.6-0.3-5.2-0.9c-1.5-0.6-2.9-1.4-4-2.5c-1.1-1.1-1.9-2.4-2.6-3.9c-0.6-1.5-0.9-3.3-0.9-5.2
        V12.5h5.6v17.7c0,1.5,0.2,2.7,0.7,3.7c0.5,1,1.1,1.8,1.8,2.3s1.5,1,2.3,1.2c0.8,0.2,1.5,0.3,2.2,0.3c0.6,0,1.4-0.1,2.2-0.3
        c0.8-0.2,1.6-0.6,2.3-1.2c0.7-0.6,1.3-1.3,1.8-2.3s0.7-2.2,0.7-3.7V12.5h5.6v17.8c0,1.9-0.3,3.6-0.9,5.2c-0.6,1.5-1.4,2.9-2.5,3.9
        c-1.1,1.1-2.4,1.9-4,2.5C100.3,42.5,98.6,42.8,96.6,42.8z"
                />
                <path
                    fill={fillColor}
                    // eslint-disable-next-line max-len
                    d="M120.1,32.8v9.5h-5.6V12.5h13.3c1.5,0,2.9,0.2,4.1,0.8c1.3,0.5,2.3,1.2,3.2,2.1c0.9,0.9,1.6,2,2.1,3.2
        c0.5,1.3,0.7,2.6,0.7,4.1c0,1.1-0.2,2.2-0.5,3.2c-0.3,1.1-0.7,2-1.2,2.8c-0.5,0.8-1.2,1.6-1.9,2.2c-0.8,0.6-1.6,1-2.5,1.3l7.3,10
        h-6.7l-6.8-9.5L120.1,32.8L120.1,32.8z M120.1,27.8h6.4c1.2,0,2.1-0.2,2.9-0.5c0.8-0.3,1.4-0.7,1.8-1.2c0.5-0.5,0.7-1,0.9-1.6
        c0.2-0.6,0.2-1.2,0.2-1.9c0-0.7-0.1-1.4-0.3-2c-0.2-0.6-0.6-1.2-1-1.6c-0.5-0.5-1.1-0.8-1.8-1.1s-1.6-0.4-2.7-0.4h-6.4L120.1,27.8
        L120.1,27.8z"
                />
                <g
                    fill={colors.brand.coral}
                    fontFamily="Nationale-DemiBold, Nationale"
                    fontSize="40.5"
                    fontWeight="600"
                >
                    <text transform="translate(156 -5)">
                        <tspan x="0" y="46.518">
                            Tavla
                        </tspan>
                    </text>
                </g>
            </g>
        </svg>
    )
}

interface Props {
    className?: string
    theme?: 'dark' | 'light'
    height?: number | string
    width?: number | string
}

export default TavlaLogo
