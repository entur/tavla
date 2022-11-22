import React from 'react'
import { Theme } from '../../types'
import { useThemeColor } from '../../hooks/useThemeColor'

interface Props {
    className?: string
}

function ValidationExclamation({ className }: Props): JSX.Element {
    const exclamationIconColor = useThemeColor(
        {
            [Theme.DARK]: '#171717',
            [Theme.DEFAULT]: '#292c6a',
        },
        'black',
    )

    return (
        <svg
            version="1.1"
            id="Layer_1"
            xmlns="http://www.w3.org/2000/svg"
            x="0"
            y="0"
            width="16px"
            height="16px"
            viewBox="0 0 16 16"
            enableBackground="new 0 0 16 16"
            className={className}
        >
            <path
                id="path-1_1_"
                fillRule="evenodd"
                clipRule="evenodd"
                fill="#efd358"
                d="M8,1C4.1500001,1,1,4.1500001,1,8s3.1500001,7,7,7
	s7-3.1499996,7-7S11.8500004,1,8,1L8,1z"
            />
            <path
                id="Icon-Fill"
                fillRule="evenodd"
                clipRule="evenodd"
                fill={exclamationIconColor}
                d="M8.0050001,10.5c0.4832487,0,0.875,0.3917503,0.875,0.875
	s-0.3917513,0.875-0.875,0.875s-0.875-0.3917503-0.875-0.875S7.5217509,10.5,8.0050001,10.5z M8.6999998,4v5.1000004H7.3000002V4
	H8.6999998z"
            />
        </svg>
    )
}

export { ValidationExclamation }
