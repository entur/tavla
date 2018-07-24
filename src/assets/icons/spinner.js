import React from 'react'
import Proptypes from 'prop-types'

function Spinner({ height, color, spin }) {
    return (
        <svg
            className={spin ? 'spinner' : ''}
            width={height}
            height={height}
            viewBox="0 -256 1792 1792"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fill={color}
                // eslint-disable-next-line max-len
                d="M617.4915 1123.7966q0 60-42.5 102t-101.5 42q-60 0-102-42t-42-102q0-60 42-102t102-42q59 0 101.5 42t42.5 102zm432 192q0 53-37.5 90.5t-90.5 37.5q-53 0-90.5-37.5t-37.5-90.5q0-53 37.5-90.5t90.5-37.5q53 0 90.5 37.5t37.5 90.5zm-608-640q0 66-47 113t-113 47q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113zm1040 448q0 46-33 79t-79 33q-46 0-79-33t-33-79q0-46 33-79t79-33q46 0 79 33t33 79zm-832-896q0 73-51.5 124.5t-124.5 51.5q-73 0-124.5-51.5t-51.5-124.5q0-73 51.5-124.5t124.5-51.5q73 0 124.5 51.5t51.5 124.5zm464-192q0 80-56 136t-136 56q-80 0-136-56t-56-136q0-80 56-136t136-56q80 0 136 56t56 136zm544 640q0 40-28 68t-68 28q-40 0-68-28t-28-68q0-40 28-68t68-28q40 0 68 28t28 68zm-208-448q0 33-23.5 56.5t-56.5 23.5q-33 0-56.5-23.5t-23.5-56.5q0-33 23.5-56.5t56.5-23.5q33 0 56.5 23.5t23.5 56.5z"
            />
        </svg>
    )
}
Spinner.propTypes = {
    color: Proptypes.string,
    height: Proptypes.oneOfType([Proptypes.number, Proptypes.string]),
    spin: Proptypes.bool,
}

Spinner.defaultProps = {
    height: 25,
    color: '#565659',
    spin: true,
}

export default Spinner
