import React from 'react'
import Proptypes from 'prop-types'

function Metro({ height, color }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 38 38"
            width={height}
            height={height}
        >
            <defs>
                <path
                    id="metro"
                    // eslint-disable-next-line max-len
                    d="M21.7143 16.2857v13.5714h-5.4286V16.2857h-5.4286v-5.4286H27.143v5.4286h-5.4286zM19 38C8.5066 38 0 29.4934 0 19S8.5066 0 19 0s19 8.5066 19 19-8.5066 19-19 19zm0-3.9018c8.3385 0 15.0982-6.7597 15.0982-15.0982S27.3385 3.9018 19 3.9018 3.9018 10.6615 3.9018 19 10.6615 34.0982 19 34.0982z"
                />
            </defs>
            <g fill="none" fillRule="evenodd">
                <mask id="metro-mask" fill="#fff">
                    <use xlinkHref="#metro"/>
                </mask>
                <use fill={color} xlinkHref="#metro"/>
                <g fill={color} mask="url(#metro-mask)">
                    <path d="M-83.125-80.75h216v216h-216z"/>
                </g>
            </g>
        </svg>
    )
}
Metro.propTypes = {
    color: Proptypes.string,
    height: Proptypes.oneOfType([Proptypes.number, Proptypes.string]),
}

Metro.defaultProps = {
    height: 12,
    width: 12,
    color: '#0F7CDB',
}

export default Metro
