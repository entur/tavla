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
            <g fill={color} fillRule="nonzero">
                <path
                // eslint-disable-next-line max-len
                    d="M16 12v10h-4V12H8V8h12v4h-4zm-2 16C6.268 28 0 21.732 0 14S6.268 0 14 0s14 6.268 14 14-6.268 14-14 14zm0-2.875c6.144 0 11.125-4.98 11.125-11.125 0-6.144-4.98-11.125-11.125-11.125C7.856 2.875 2.875 7.855 2.875 14c0 6.144 4.98 11.125 11.125 11.125z"
                />
                <mask id="b" fill={color}>
                    <use xlinkHref="#a"/>
                </mask>
                <use fill={color} xlinkHref="#a"/>
                <g mask="url(#b)" fill={color}>
                    <path d="M-61.25-59.5h159v159h-159z"/>
                </g>
            </g>
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
