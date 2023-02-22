import React from 'react'
import { Theme } from 'src/types'
import { useThemeColor } from 'hooks/useThemeColor'

function ValidationError({ className }: { className?: string }): JSX.Element {
    const crossIconColor = useThemeColor(
        {
            [Theme.DARK]: '#000000',
            [Theme.DEFAULT]: '292c6a',
        },
        '#ffffff',
    )
    const backgroundIconColor = useThemeColor(
        {
            [Theme.DARK]: '#FF9494',
            [Theme.DEFAULT]: '#FF9494',
        },
        '#d31b1b',
    )

    return (
        <svg
            version="1.1"
            id="Layer_1"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="16px"
            height="16px"
            viewBox="0 0 16 16"
            enableBackground="new 0 0 16 16"
            className={className}
            role="img"
        >
            <path
                id="path-1_1_"
                fillRule="evenodd"
                clipRule="evenodd"
                fill={backgroundIconColor}
                d="M8,1C4.1500001,1,1,4.1500001,1,8s3.1500001,7,7,7
	s7-3.1499996,7-7S11.8500004,1,8,1L8,1z"
            />
            <path
                id="Icon-Fill"
                fillRule="evenodd"
                clipRule="evenodd"
                fill={crossIconColor}
                d="M10.0504799,4.9595709l0.9899492,0.9899492
	L8.9885712,7.9995708l2.0518579,2.050909l-0.9899492,0.9899492l-2.050909-2.0518579l-2.0500507,2.0518579l-0.9899492-0.9899492
	l2.0499997-2.050909L4.9595709,5.9495201l0.9899492-0.9899492l2.0500507,2.0499997L10.0504799,4.9595709z"
            />
        </svg>
    )
}

export { ValidationError }
