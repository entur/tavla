import React from 'react'
import Proptypes from 'prop-types'

function Bus({ height, width, color }) {
    return (
        <svg width={width} height={height} xmlns="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/1999/xlink">
            <path
                // eslint-disable-next-line max-len
                d="M12.087 4.012h3.193V1.36h-3.193v2.653zm-3.789 0h3.199V1.36H8.298v2.653zm-3.789 0h3.193V1.36H4.509v2.653zm-3.789 0h3.193V1.36H.72v2.653zM15.673 0c.179 0 .327.147.327.327V6.5a.33.33 0 0 1-.327.327H13.25a1.724 1.724 0 0 0-1.711-1.923 1.723 1.723 0 0 0-1.713 1.923H6.173a1.723 1.723 0 0 0-1.711-1.923 1.723 1.723 0 0 0-1.714 1.923H.327A.328.328 0 0 1 0 6.5V.327C0 .147.147 0 .327 0h15.346zM5.714 6.626c0 .69-.56 1.25-1.252 1.25-.694 0-1.255-.56-1.255-1.25s.561-1.25 1.255-1.25c.691 0 1.252.56 1.252 1.25zm7.075 0c0 .688-.56 1.246-1.25 1.246s-1.25-.558-1.25-1.246a1.25 1.25 0 0 1 2.5 0z"
                fill={color}
            />
        </svg>
    )
}
Bus.propTypes = {
    color: Proptypes.string,
    height: Proptypes.number,
    width: Proptypes.number,
}

Bus.defaultProps = {
    height: 8,
    width: 16,
    color: '#565659',
}

export default Bus
