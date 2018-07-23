import React from 'react'
import Proptypes from 'prop-types'

function Close({ height, width, color }) {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 16 16"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs />
            <g
                id="icon/close"
                stroke="none"
                strokeWidth="1"
                fill="none"
                fillRule="evenodd"
            >
                <polygon
                    id="path-close"
                    fill={color}
                    // eslint-disable-next-line max-len
                    points="13.314 1.9999 8.364 6.9499 3.414 1.9999 2 3.4139 6.95 8.3639 2 13.3139 3.414 14.7279 8.364 9.7789 13.314 14.7279 14.728 13.3139 9.778 8.3639 14.728 3.4139"
                />
            </g>
        </svg>
    )
}
Close.propTypes = {
    color: Proptypes.string,
    height: Proptypes.oneOfType([Proptypes.number, Proptypes.string]),
    width: Proptypes.number,
}

Close.defaultProps = {
    height: 16,
    width: 16,
    color: '#565659',
}

export default Close
