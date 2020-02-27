import React from 'react'

import { Clock, BackButton } from '../../../components'
import { Github } from '../../../assets/icons'

import './styles.scss'

function AdminHeader(props: Props): JSX.Element {
    const { goBackToDashboard } = props

    return (
        <div className="admin-header">
            <div className="admin-header__left">
                <BackButton
                    size="medium"
                    className="admin-header__back-button"
                    action={goBackToDashboard}
                />
                <h1>Rediger tavle</h1>
            </div>
            <div className="admin-header__right">
                <div className="github-logo">
                    <a href="https://github.com/entur/tavla">
                        <Github size="30px" />
                    </a>
                </div>
                <Clock className="admin-header__clock" />
            </div>
        </div>
    )
}

interface Props {
    goBackToDashboard: (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ) => void
}

export default AdminHeader
