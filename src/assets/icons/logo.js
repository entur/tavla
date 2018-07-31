import React from 'react'
import Proptypes from 'prop-types'

function Logo({ height, width }) {
    return (
        <div className="footer">
            <div>
                <svg
                    className="footer-logo"
                    width={width}
                    height={height}
                    viewBox="0 0 63 19"
                    xmlns="http://www.w3.org/1999/xlink"
                >
                    <g fill="none" fillRule="evenodd">
                        <path fill={'#ffffff'} d="M1 0v13.006h9.392v-2.203H3.439V7.658h6.169V5.455H3.439V2.203h6.953V0z"/>
                        <path fill="#FF5959" d="M0 19h22.983v-2H0z"/>
                        <path
                            fill={'#ffffff'}
                            // eslint-disable-next-line max-len
                            d="M21.543 0v7.871L13.163 0H12.9v13.006h2.44V5.277l8.38 7.73h.262V0zM36.467 7.657h-3.642V18.46h-2.439V7.657h-3.66V5.454h9.74zM43.872 18.691c-.825 0-1.574-.13-2.248-.39a4.929 4.929 0 0 1-1.725-1.102 4.877 4.877 0 0 1-1.106-1.724c-.261-.675-.392-1.427-.392-2.256V5.454h2.44v7.765c0 .651.104 1.19.313 1.617.209.426.467.764.775 1.012.308.25.64.421.994.516.354.095.67.142.95.142.278 0 .594-.047.949-.142.354-.095.685-.267.993-.516.308-.248.566-.586.775-1.012.21-.427.314-.966.314-1.617V5.454h2.44v7.765c0 .83-.128 1.581-.384 2.256a4.787 4.787 0 0 1-1.098 1.724 4.934 4.934 0 0 1-1.725 1.101c-.673.26-1.428.391-2.265.391M54.57 12.153h2.78c.509 0 .928-.065 1.258-.196.33-.13.59-.302.782-.515.191-.213.321-.453.39-.72.07-.266.105-.535.105-.808 0-.32-.05-.616-.148-.888a1.906 1.906 0 0 0-.451-.711 2.16 2.16 0 0 0-.782-.48c-.319-.118-.703-.178-1.155-.178H54.57v4.496zm0 2.167v4.14h-2.439V5.454h5.795c.652 0 1.248.11 1.789.329.541.22 1.004.527 1.387.924.384.397.684.87.9 1.421.214.551.322 1.152.322 1.804 0 .486-.064.956-.192 1.412a4.795 4.795 0 0 1-.532 1.235 3.718 3.718 0 0 1-.838.95 2.952 2.952 0 0 1-1.09.56l3.175 4.371h-2.91l-2.952-4.14H54.57z"
                        />
                    </g>
                </svg>
                <p>Finn din rute på en-tur.no eller i Entur-appen</p>
            </div>
        </div>
    )
}
Logo.propTypes = {
    height: Proptypes.oneOfType([Proptypes.number, Proptypes.string]),
    width: Proptypes.oneOfType([Proptypes.number, Proptypes.string]),
}

Logo.defaultProps = {
    height: 35,
    width: 111,
}

export default Logo
