import React from 'react'
import { colors } from '@entur/tokens'

function ResizeHandle({ className, size, variant }: Props): JSX.Element | null {
    const color =
        variant === 'light'
            ? colors.blues.blue60
            : 'var(--tavla-background-color)'
    return (
        <svg
            className={className}
            width={size}
            height={size}
            viewBox="0 0 39 39"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            role="img"
        >
            <title>resizekort copy 4</title>

            <g
                id="Resize"
                stroke="none"
                strokeWidth="1"
                fill="current"
                fillRule="evenodd"
                strokeLinecap="round"
            >
                <g
                    id="tavla:modul-4_avvik+med-og-uten-plattform-copy"
                    transform="translate(-630.000000, -886.000000)"
                    stroke={color}
                    strokeWidth="3"
                >
                    <g
                        id="resizekort-copy-4"
                        transform="translate(649.500000, 905.500000) scale(-1, 1) translate(-649.500000, -905.500000) translate(632.000000, 888.000000)"
                    >
                        <line
                            x1="0"
                            y1="23.7096774"
                            x2="11.2903226"
                            y2="35"
                            id="Path"
                        ></line>
                        <line
                            x1="0"
                            y1="12.4193548"
                            x2="22.5806452"
                            y2="35"
                            id="Path"
                        ></line>
                        <line x1="0" y1="0" x2="35" y2="35" id="Path"></line>
                    </g>
                </g>
            </g>
        </svg>
    )
}

interface Props {
    className?: string
    size?: string
    variant?: 'light' | 'dark'
}

export { ResizeHandle }
