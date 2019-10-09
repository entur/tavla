import React from 'react'

import { Clock, BackButton } from '../../components'

import './styles.scss'

function AdminHeader(props: Props): JSX.Element {
    const { goBackToDashboard } = props

    return (
        <div className="header header-container">
            <div className="admin-header">
                <BackButton className="admin-header--back-button" action={goBackToDashboard} />
                <p>Rediger tavle</p>
            </div>
            <Clock />
        </div>
    )
}

interface Props {
    goBackToDashboard: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
}

export default AdminHeader
