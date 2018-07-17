import React from 'react'
import Proptypes from 'prop-types'

function Lock({ height, color }) {
    return (
        <svg
            viewBox="0 0 21 28"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            width={height*0.75}
            height={height}
        >
            <defs>
                <path id="lock" d="M1 0h19v13H1z"/>
            </defs>
            <g fill="none" fillRule="evenodd" transform="translate(0 -2)">
                <circle cx="10.5" cy="19.5" r="9" stroke={color} strokeWidth="3"/>
                <g fill={color} transform="translate(9 16)">
                    <ellipse cx="1.5" cy="1.6" rx="1.5" ry="1.6"/>
                    <path d="M1.5 1.6L3 6H0z"/>
                </g>
                <mask id="lock-mask" fill="#fff">
                    <use xlinkHref="#lock"/>
                </mask>
                <ellipse cx="10.2841" cy="15.9077" stroke={color} strokeWidth="3" mask="url(#lock-mask)" rx="6.4886" ry="12.2077"/>
            </g>
        </svg>
    )
}
Lock.propTypes = {
    color: Proptypes.string,
    height: Proptypes.oneOfType([Proptypes.number, Proptypes.string]),
}

Lock.defaultProps = {
    height: 28,
    width: 28*0.75,
    color: '#FF5959',
}

export default Lock
