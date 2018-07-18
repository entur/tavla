import React from 'react'
import Proptypes from 'prop-types'

function Tram({ height, color }) {
    return (
        <svg
            viewBox="0 0 14 11"
            width={height*1.27 + 'rem'}
            height={height + 'rem'}
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fill={color}
                fillRule="evenodd"
                // eslint-disable-next-line max-len
                d="M13.027 3.067a.349.349 0 0 0-.339-.267H7.497l.791-.796a.386.386 0 0 0 .103-.262.35.35 0 0 0-.1-.244L6.927.105a.35.35 0 0 0-.5.49l1.128 1.153L6.51 2.8H1.308a.349.349 0 0 0-.34.267S0 7.424 0 7.7c0 .276.624 1.168.624 1.168a.35.35 0 0 0 .328.232h2.003l.338.536a.348.348 0 0 0 .296.164h-2.54a.35.35 0 0 0 0 .7h11.897a.35.35 0 0 0 0-.7h-2.539c.12 0 .233-.062.296-.164l.338-.536h2.002a.35.35 0 0 0 .33-.232s.623-.892.623-1.168c0-.276-.969-4.633-.969-4.633zM2.8 5.95c0 .193.193.35 0 .35H1.4a.35.35 0 0 1-.34-.426l.308-1.4a.35.35 0 0 1 .341-.274H2.8c.193 0 0 .157 0 .35v1.4zm3.5 0a.35.35 0 0 1-.35.35h-2.1a.35.35 0 0 1-.35-.35v-1.4a.35.35 0 0 1 .35-.35h2.1a.35.35 0 0 1 .35.35v1.4zM4.808 9.8c.12 0 .232-.062.296-.164l.337-.536h3.112l.337.536a.348.348 0 0 0 .296.164H4.809zm4.988-3.85a.35.35 0 0 1-.35.35h-2.1a.35.35 0 0 1-.349-.35v-1.4a.35.35 0 0 1 .35-.35h2.1a.35.35 0 0 1 .35.35v1.4zm3.072.22a.351.351 0 0 1-.273.13h-1.4c-.192 0-.7-.157-.7-.35v-1.4c0-.193.508-.35.7-.35h1.092a.35.35 0 0 1 .341.275l.309 1.4a.349.349 0 0 1-.069.294z"
            />
        </svg>
    )
}
Tram.propTypes = {
    color: Proptypes.string,
    height: Proptypes.oneOfType([Proptypes.number, Proptypes.string]),
}

Tram.defaultProps = {
    height: 1,
    color: '#0F7CDB',
}

export default Tram
