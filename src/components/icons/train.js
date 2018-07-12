import React from 'react'
import Proptypes from 'prop-types'

function Train({ height, width, color }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width={width} height={height}>
            <defs>
                <path
                    id="a"
                    // eslint-disable-next-line max-len
                    d="M0 3.8108v6.4612h13.3614c.5489 0 1.0664-.2196 1.427-.596.3608-.3607.596-.8782.596-1.427 0-.5646-.2195-1.0665-.596-1.4272l-2.9012-2.8855c-.0784-.0784-.1881-.1255-.2822-.1255H5.2536l3.058-1.5525c.2353-.1255.2353-.3294 0-.4548L4.8773 0h-1.725l-.0157.0157L6.9787 2.023 3.4815 3.8108H0zm9.2683.8469h2.1955l1.4271 1.427H9.2683v-1.427zm3.6853 7.4177H0V11.26h12.9536v.8155z"
                />
            </defs>
            <g fill="none" fill-rule="evenodd">
                <mask id="b" fill="#fff">
                    <use xlink:href="#a"/>
                </mask>
                <use fill={color} fill-rule="nonzero" xlink:href="#a"/>
                <g fill={color} mask="url(#b)">
                    <path d="M-25.7778-28.6667h71v71h-71z"/>
                </g>
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
    height: 8,
    width: 16,
    color: '#E5905A',
}

export default Train
