import React from 'react'
import Proptypes from 'prop-types'

function GeoLocation({ height, color }) {
    return (
        <svg
            width={height}
            height={height}
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
        >
            <g fill={color} fillRule="evenodd">
                <path
                    // eslint-disable-next-line max-len
                    d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm1 13.9V12H7v1.9c-2.5-.4-4.5-2.4-4.9-4.9H4V7H2.1C2.5 4.5 4.5 2.5 7 2.1V4h2V2.1c2.5.4 4.5 2.4 4.9 4.9H12v2h1.9c-.4 2.5-2.4 4.5-4.9 4.9z"
                />
                <path d="M8 6c1.105 0 2 .895 2 2s-.895 2-2 2-2-.895-2-2 .895-2 2-2"/>
            </g>

        </svg>
    )
}
GeoLocation.propTypes = {
    color: Proptypes.string,
    height: Proptypes.oneOfType([Proptypes.number, Proptypes.string]),
}

GeoLocation.defaultProps = {
    height: 18,
    color: '#565659',
}

export default GeoLocation
