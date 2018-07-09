import React from 'react'
import { Route, Switch } from 'react-router-dom'

import App from './containers/App'
import DepartureBoard from './containers/DepartureBoard'
import AdminPage from './containers/AdminPage'

const routes = (
    <div>
        <App>
            <Switch>
                <Route path="/" component={DepartureBoard} />
                <Route path="/admin" component={AdminPage} />
            </Switch>
        </App>
    </div>
)

export default routes
