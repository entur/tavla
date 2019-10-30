import React, { useCallback } from 'react'

import WhiteTavlaLogo from '../../assets/icons/whiteTavlaLogo/whiteTavlaLogo'
import { Footer, Clock } from '../../components'

import './styles.scss'

function DashboardWrapper(props: Props): JSX.Element {
    const { className, children, history } = props

    const onSettingsButtonClick = useCallback(event => {
        const path = window.location.pathname.split('@')[1]
        history.push(`/admin/@${path}`)
        event.preventDefault()
    }, [history])

    return (
        <div className={`dashboard-wrapper ${className}`}>
            <div className="dashboard-wrapper__top">
                <WhiteTavlaLogo />
                <Clock />
            </div>
            { children }
            <Footer
                className="dashboard-wrapper__footer"
                history={history}
                onSettingsButtonClick={onSettingsButtonClick}
            />
        </div>
    )
}

interface Props {
    className: string,
    children: JSX.Element,
    history: any,
}

export default DashboardWrapper
