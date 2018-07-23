import React from 'react'
import Proptypes from 'prop-types'

function CityBike({ height, width, color }) {
    return (
        <svg
            viewBox="0 0 16 16"
            width={width}
            height={height}
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
        >
            <path
                // eslint-disable-next-line max-len
                d="M13.174 9.14l-1.666-7.455c-.088-.438-.438-.701-.877-.701H7.123v1.754h2.806l.614 2.63H4.492c-.526 0-.877.352-.877.878v1.842c-1.491.35-2.631 1.754-2.631 3.42a3.518 3.518 0 0 0 3.508 3.508A3.518 3.518 0 0 0 8 11.508c0-1.666-1.14-2.982-2.631-3.42v-.965h5.525l.439 1.842a3.018 3.018 0 0 0-2.456 2.982c0 1.666 1.403 3.07 3.07 3.07 1.666 0 3.07-1.404 3.07-3.07 0-1.228-.79-2.368-1.843-2.807zm-6.928 2.368a1.76 1.76 0 0 1-1.754 1.754 1.76 1.76 0 0 1-1.754-1.754c0-.965.79-1.754 1.754-1.754.965 0 1.754.79 1.754 1.754zm5.7 1.754c-.701 0-1.315-.614-1.315-1.315 0-.702.614-1.316 1.316-1.316.701 0 1.315.614 1.315 1.316 0 .701-.614 1.315-1.315 1.315zM1.862 2.738h3.508v1.754H1.86V2.738z"
                fill={color}
            />
        </svg>
    )
}
CityBike.propTypes = {
    color: Proptypes.string,
    height: Proptypes.oneOfType([Proptypes.number, Proptypes.string]),
    width: Proptypes.oneOfType([Proptypes.number, Proptypes.string]),
}

CityBike.defaultProps = {
    height: 30,
    width: 30,
    color: '#565659',
}

export default CityBike
