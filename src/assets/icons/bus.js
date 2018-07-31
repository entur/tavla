import React from 'react'
import Proptypes from 'prop-types'

function Bus({
    height, width, color, className,
}) {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 32 32"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <g fill={color} fillRule="nonzero">
                <path
                // eslint-disable-next-line max-len
                    d="M27.805 17.078l-1.18-7.084a.59.59 0 0 0-.582-.494H5.38c-.59 0-1.181.59-1.181 1.18v8.857c0 .294.216.59.507.59h2.505a2.956 2.956 0 0 1 2.891-2.362 2.958 2.958 0 0 1 2.893 2.362h6.022a2.958 2.958 0 0 1 2.892-2.362 2.958 2.958 0 0 1 2.893 2.362h2.42a.59.59 0 0 0 .59-.59v-2.362a.536.536 0 0 0-.008-.097zM7.742 14.814a.59.59 0 0 1-.59.59H5.97a.59.59 0 0 1-.59-.59v-2.362a.59.59 0 0 1 .59-.59h1.18a.59.59 0 0 1 .591.59v2.362zm7.084 0a.59.59 0 0 1-.59.59H9.513a.59.59 0 0 1-.59-.59v-2.362a.59.59 0 0 1 .59-.59h4.723a.59.59 0 0 1 .59.59v2.362zm7.084 0a.59.59 0 0 1-.59.59h-4.723a.59.59 0 0 1-.59-.59v-2.362a.59.59 0 0 1 .59-.59h4.723a.59.59 0 0 1 .59.59v2.362zm4.36.39a.591.591 0 0 1-.445.2h-2.144a.59.59 0 0 1-.59-.59v-2.362a.59.59 0 0 1 .59-.59h1.834c.296 0 .546.22.584.513l.312 2.362a.59.59 0 0 1-.142.466z"
                />
                <path
                    // eslint-disable-next-line max-len
                    d="M10.103 18.946a1.772 1.772 0 1 0 .002 3.544 1.772 1.772 0 0 0-.002-3.544M21.91 18.946a1.772 1.772 0 1 0 .002 3.544 1.772 1.772 0 0 0-.002-3.544"
                />
            </g>
        </svg>
    )
}
Bus.propTypes = {
    color: Proptypes.string,
    height: Proptypes.number,
    width: Proptypes.number,
}

Bus.defaultProps = {
    height: 20,
    width: 20,
    color: '#5AC39A',
}

export default Bus
