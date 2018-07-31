import React from 'react'
import Proptypes from 'prop-types'

function Metro({
    height, width, color, className,
}) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 32 32"
            width={width}
            height={height}
            className={className}
        >
            <path
                // eslint-disable-next-line max-len
                d="M12.52 13.24h2.78v6.97h1.4v-6.97h2.78v-1.39h-6.96v1.39"
                fill={color}
            />
            <path
                // eslint-disable-next-line max-len
                d="M16 7.67a7.67 7.67 0 1 0 7.67 7.66A7.67 7.67 0 0 0 16 7.67zm0 13.94a6.28 6.28 0 1 1 6.27-6.28A6.28 6.28 0 0 1 16 21.61z"
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
    height: 30,
    width: 30,
    color: '#0F7CDB',
}

export default Metro
