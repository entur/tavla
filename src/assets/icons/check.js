import React from 'react'
import Proptypes from 'prop-types'

function Check({
    height, width, color,
}) {
    return (
        <svg
            width={width}
            height={height}
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <path id="a" d="M9.046 11.4l-1.97-2L5.6 10.9l3.446 3.5 6.4-6.5-1.477-1.5z"/>
            </defs>
            <use
                fill={color}
                transform="translate(-5 -6)"
                fill-rule="evenodd"
            />
        </svg>
    )
}
Check.propTypes = {
    color: Proptypes.string,
    height: Proptypes.number,
    width: Proptypes.number,
}

Check.defaultProps = {
    height: 11,
    width: 9,
    color: '#fff',
}

export default Check
