import React from 'react'
import { Route } from 'react-router-dom'

import { useUser } from '../../auth'
import { getDocumentId } from '../../utils'
import { useSettingsContext } from '../../settings'

function PrivateRoute({
    path,
    exact,
    component,
    errorComponent,
}: Props): JSX.Element {
    const [settings] = useSettingsContext()
    const user = useUser()

    if (!getDocumentId())
        return <Route path={path} exact={exact} component={component} />

    if (!settings || !user) return null

    const permitted =
        !settings.owners ||
        settings.owners.length === 0 ||
        settings.owners.includes(user.uid)

    return permitted ? (
        <Route path={path} exact={exact} component={component} />
    ) : (
        <Route path={path} exact={exact} component={errorComponent} />
    )
}

interface Props {
    component: ({ history }: HistoryProps) => JSX.Element
    errorComponent: ({ history }: HistoryProps) => JSX.Element
    path: string
    exact: boolean
}

interface HistoryProps {
    history: any
}

export default PrivateRoute
