import React from 'react'
import { Route, Redirect } from 'react-router-dom'

import { getDocumentId } from '../../utils'

function PrivateRoute({ path, exact, component }: Props): JSX.Element {
    const documentId = getDocumentId()
    const permission = true
    return permission ? (
        <Route path={path} exact={exact} component={component} />
    ) : (
        <Redirect to={`/permissionDenied/${documentId}`} />
    )
}

interface Props {
    component: ({ history }: HistoryProps) => JSX.Element
    path: string
    exact: boolean
}

interface HistoryProps {
    history: any
}

export default PrivateRoute
