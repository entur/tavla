import React from 'react'
import Proptypes from 'prop-types'

function CityBike({ height, width, color }) {
    return (
        <svg
            viewBox="0 0 32 32"
            width={width}
            height={height}
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
        >
            <path
                // eslint-disable-next-line max-len
                d="M22.06 17.27l-1.93-8.61a1 1 0 0 0-1-.81h-4.06v2h3.24l.71 3H12a1 1 0 0 0-1 1v2.13A4.06 4.06 0 1 0 16.08 20a4.14 4.14 0 0 0-3-3.95v-1.11h6.38l.51 2.12a3.5 3.5 0 0 0-2.84 3.45 3.55 3.55 0 1 0 5-3.24zm-8 2.73a2 2 0 1 1-2-2 2 2 0 0 1 2 2zm6.59 2a1.52 1.52 0 1 1 1.52-1.52A1.56 1.56 0 0 1 20.64 22zM9 9.87h4v2H9z"
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
    height: 40,
    width: 40,
    color: '#FF5959',
}

export default CityBike
