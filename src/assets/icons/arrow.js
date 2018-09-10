import React from 'react'
import Proptypes from 'prop-types'

function Arrow({ height, width }) {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 26 24"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
        >
            <title>84287AAB-2E62-4C16-8580-BB1AB6DFFFC9-92525-0000D1D002088A97</title>
            <desc>Created with sketchtool.</desc>
            <defs>
                <polygon
                    id="path-1"
                    points="14.88 4.8 12.64 7.14029851 19.52 14.3283582 0 14.3283582 0 17.6716418 19.52 17.6716418 12.64 24.8597015 14.88 27.2 25.6 16"
                />
            </defs>
            <g
                id="Mainpage"
                stroke="none"
                strokeWidth="1"
                fill="none"
                fillRule="evenodd"
            >
                <g
                    id="tavla:modul1"
                    transform="translate(-70.000000, -940.000000)"
                >
                    <g
                        id="quarks/icon/16/arrow-left"
                        transform="translate(70.000000, 936.000000)"
                    >
                        <mask id="mask-2" fill="white">
                            <use href="#path-1" />
                        </mask>
                        <use
                            id="arrow"
                            fill="#FF5959"
                            transform="translate(12.800000, 16.000000) rotate(-180.000000) translate(-12.800000, -16.000000) "
                            href="#path-1"
                        />
                    </g>
                </g>
            </g>
        </svg>
    )
}

Arrow.propTypes = {
    height: Proptypes.oneOfType([Proptypes.number, Proptypes.string]),
    width: Proptypes.number,
}

Arrow.defaultProps = {
    height: 40,
    width: 40,
}

export default Arrow
