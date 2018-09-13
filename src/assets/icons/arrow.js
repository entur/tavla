import React from 'react'
import Proptypes from 'prop-types'

function Arrow({ height, width }) {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 26 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <path
                    id="a"
                    d="M14.88 4.8l-2.24 2.34 6.88 7.188H0v3.344h19.52l-6.88 7.188 2.24 2.34L25.6 16z"
                />
            </defs>
            <use
                fill="#FF5959"
                transform="rotate(-180 12.8 14)"
                href="#a"
            />
        </svg>
    )
}

Arrow.propTypes = {
    height: Proptypes.oneOfType([Proptypes.number, Proptypes.string]),
    width: Proptypes.number,
}

Arrow.defaultProps = {
    height: 40,
    width: 40,
}

export default Arrow
