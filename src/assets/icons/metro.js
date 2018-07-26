import React from 'react'
import Proptypes from 'prop-types'

function Metro({ height, width, color }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 32 32"
            width={width}
            height={height}
        >
            <path
                // eslint-disable-next-line max-len
                d="M17.43 14.57v7.17h-2.86v-7.17H11.7V11.7h8.6v2.87zM16 26a10 10 0 1 1 10-10 10 10 0 0 1-10 10zm0-2a8 8 0 1 0-8-8 8 8 0 0 0 8 8z"
                fill={color}
            />

        </svg>

    )
}
Metro.propTypes = {
    color: Proptypes.string,
    height: Proptypes.number,
    width: Proptypes.number,
}

Metro.defaultProps = {
    height: 20,
    width: 20,
    color: '#0F7CDB',
}

export default Metro
