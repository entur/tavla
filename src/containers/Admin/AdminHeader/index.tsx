import React from 'react'

import { Clock, BackButton } from '../../../components'

import './styles.scss'

function AdminHeader(props: Props): JSX.Element {
    const { goBackToDashboard } = props

    return (
        <div className="admin-header">
            <div className="admin-header__left">
                <BackButton size="medium" className="admin-header__back-button" action={goBackToDashboard} />
                <h1>Rediger tavle</h1>
            </div>
            <Clock />
        </div>
    )
}

interface Props {
    goBackToDashboard: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
}

export default AdminHeader
