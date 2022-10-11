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
}: Props): JSX.Element | null {
    const [settings] = useSettingsContext()
    const user = useUser()

    if (!component || !settings || !user) return null

    if (!getDocumentId())
        return <Route path={path} exact={exact} component={component} />

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
    component: (() => JSX.Element) | null
    errorComponent: () => JSX.Element
    path: string
    exact: boolean
}

export { PrivateRoute }
