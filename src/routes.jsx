import React from 'react'
import {
    Route, Switch, Redirect,
} from 'react-router-dom'
import './main.scss'
import DepartureBoard from './containers/DepartureBoard'
import AdminPage from './containers/AdminPage'

export const routes = (
    <div className="App">
        <Switch>
            <Route exact path="/" component={DepartureBoard} />
            <Route path="/admin" component={AdminPage} />
            <Redirect to="/" />
        </Switch>
    </div>
)
