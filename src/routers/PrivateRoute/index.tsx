import React from 'react'
import { Route } from 'react-router-dom'

import { useUser } from '../../auth'
import usePermittedTavle from '../../logic/usePermittedTavle'

function PrivateRoute({
    path,
    exact,
    component,
    errorComponent,
}: Props): JSX.Element {
    const permitted = usePermittedTavle()
    const user = useUser()

    if (!user) return null

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
