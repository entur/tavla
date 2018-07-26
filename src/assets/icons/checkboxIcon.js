import React from 'react'
import Proptypes from 'prop-types'

function checkboxIcon({
    height, width, color,
}) {
    return (
        <svg
            viewBox="0 0 27 27"
            width={width}
            height={height}
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M4.55 6.875l-2.6-2.75L0 6.188 4.55 11 13 2.062 11.05 0z"/>
            <use fill={color} fillRule="evenodd"/>
        </svg>
    )
}
checkboxIcon.propTypes = {
    color: Proptypes.string,
    height: Proptypes.number,
    width: Proptypes.number,
}

checkboxIcon.defaultProps = {
    height: 27,
    width: 27,
    color: '#FF5959',
}

export default checkboxIcon
