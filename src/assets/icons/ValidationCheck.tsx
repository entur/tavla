import React from 'react'
import { Theme } from 'src/types'
import { useThemeColor } from 'hooks/useThemeColor'
import { colors } from '@entur/tokens'

function ValidationCheck(): JSX.Element {
    const checkIconColor = colors.validation.mintContrast

    const backgroundIconColor = useThemeColor(
        {
            [Theme.DARK]: '#000',
            [Theme.DEFAULT]: colors.brand.blue,
        },
        colors.brand.white,
    )

    return (
        <svg
            version="1.1"
            id="Layer_1"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="2em"
            height="2em"
            viewBox="0 0 16 16"
            enableBackground="new 0 0 16 16"
            role="img"
        >
            <path
                id="path-1_1_"
                fillRule="evenodd"
                clipRule="evenodd"
                fill={backgroundIconColor}
                d="M8,1c3.8659163,0,7,3.1340833,7,7s-3.1340837,7-7,7
	s-7-3.1340837-7-7S4.1340833,1,8,1z"
            />
            <path
                id="Icon-Fill"
                fillRule="evenodd"
                clipRule="evenodd"
                fill={checkIconColor}
                d="M11.0819254,5L12,5.9449263l-4.7212839,4.8593731
	C7.050549,11.0391397,6.6947932,11.062624,6.4411082,10.874752L6.360642,10.8042994L4,8.3746128l0.9180741-0.9449263
	l1.9013519,1.9567413L11.0819254,5z"
            />
        </svg>
    )
}

export { ValidationCheck }
