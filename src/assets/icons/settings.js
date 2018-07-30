import React from 'react'
import Proptypes from 'prop-types'

function Settings({ height, width, color }) {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 16 16"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
        >
            <title>icon/settings</title>
            <desc>Created with Sketch.</desc>
            <defs>
                <path
                    // eslint-disable-next-line max-len
                    d="M8.5,11.5 C6.8,11.5 5.5,10.2 5.5,8.5 C5.5,6.8 6.8,5.5 8.5,5.5 C10.2,5.5 11.5,6.8 11.5,8.5 C11.5,10.2 10.2,11.5 8.5,11.5 M13.8,5.7 L14.9,3.6 L13.5,2.2 L11.4,3.3 C11.1,3.1 10.7,3 10.3,2.9 L9.5,0.5 L7.5,0.5 L6.7,2.8 C6.4,2.9 6,3 5.7,3.2 L3.6,2.1 L2.1,3.6 L3.2,5.7 C3,6 2.9,6.4 2.8,6.7 L0.5,7.5 L0.5,9.5 L2.8,10.3 C2.9,10.7 3.1,11 3.2,11.4 L2.1,13.5 L3.5,14.9 L5.6,13.8 C5.9,14 6.3,14.1 6.7,14.2 L7.5,16.5 L9.5,16.5 L10.3,14.2 C10.7,14.1 11,13.9 11.4,13.8 L13.5,14.9 L14.9,13.5 L13.8,11.4 C14,11.1 14.1,10.7 14.2,10.3 L16.5,9.5 L16.5,7.5 L14.2,6.7 C14.1,6.4 14,6 13.8,5.7"
                    id="path-settings"
                />
            </defs>
            <g
                id="icon/settings"
                stroke="none"
                strokeWidth="1"
                fill="none"
                fillRule="evenodd"
            >
                <g id="color/primary">
                    <mask id="mask-settings" fill="white">
                        <use xlinkHref="#path-settings" />
                    </mask>
                    <use id="Mask" fill={color} xlinkHref="#path-settings" />
                    <g id="color/grey" mask="url(#mask-settings)" fill="#565659" />
                </g>
            </g>
        </svg>
    )
}
Settings.propTypes = {
    color: Proptypes.string,
    height: Proptypes.oneOfType([Proptypes.number, Proptypes.string]),
    width: Proptypes.number,
}

Settings.defaultProps = {
    height: 40,
    width: 40,
    color: '#d2d2d2',
}

export default Settings
