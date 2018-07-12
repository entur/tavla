import React from 'react'
import {
    Route, Switch, Redirect,
} from 'react-router-dom'
import './main.scss'
import DepartureBoard from './containers/departureBoard/DepartureBoard'
import AdminPage from './containers/AdminPage'
import App from './containers/App'
import Footer from './components/Footer'

export const routes = (
    <div className="App">
        <Switch>
            <Route exact path="/" component={App} />
            <Route path="/dashboard" component={DepartureBoard} />
            <Route path="/admin" component={AdminPage} />
            <Redirect to="/" />
        </Switch>
        <Footer />
    </div>
)
