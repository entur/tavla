import React from 'react'

function AddBoardIcon({ className }: { className?: string }): JSX.Element {
    return (
        <svg
            width="464px"
            height="286px"
            viewBox="-50 -50 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            className={className}
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="m 0.6999999,-7 -0.001,6.3 H 7.0000002 V 0.7 H 0.6989997 l 0.001,6.3 h -1.4 V 0.7 h -6.2999999 v -1.4 h 6.2999999 V -7 Z"
                fill="currentColor"
            />
        </svg>
    )
}

export { AddBoardIcon }
