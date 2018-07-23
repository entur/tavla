import React from 'react'
import Proptypes from 'prop-types'

function Train({ height, width, color }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            width={width}
            height={height}
            viewBox="0 0 32 32"
        >
            <g fill={color} fillRule="nonzero">
                <path
                    // eslint-disable-next-line max-len
                    d="M27.518 14.576c-.521-.52-3.779-2.934-5.588-4.133-.592-.39-1.253-.549-1.648-.549h-7.01l3.412-1.706a.55.55 0 0 0 0-.982L12.29 5.558a.55.55 0 0 0-.49.982l3.41 1.157-4.394 2.197H4.88v9.887h23.092l-1.098-1.648c.596-.682 1.098-1.326 1.098-1.959 0-1.407-.083-1.227-.453-1.598zm-3.825-.57c-.075.224-.286.282-.522.282h-1.098c-.119 0-.306.018-.47-.103l-1.567-1.106a.549.549 0 1 1 .33-.988h1.1c.118 0 .233.039.329.111l1.707 1.284c.189.142.266.296.19.52zM4.898 20.88v1.098h21.426a.55.55 0 0 0 0-1.099H4.898z"
                />
            </g>
        </svg>

    )
}
Train.propTypes = {
    color: Proptypes.string,
    height: Proptypes.number,
    width: Proptypes.number,
}

Train.defaultProps = {
    height: 20,
    width: 20,
    color: '#E5905A',
}

export default Train
