import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
// import routes from './routes'
import './main.scss'
import DepartureBoard from './containers/DepartureBoard'
// import AdminPage from './containers/AdminPage'


const AdminPage = () => (
    <div>
        <h1>Admin</h1>
    </div>
)

ReactDOM.render(
    <BrowserRouter>
        <div>
            <Switch>
                <Route exact path="/" component={DepartureBoard} />
                <Route exact path="/admin" component={AdminPage} />
            </Switch>
        </div>
    </BrowserRouter>,
    document.getElementById('app')
)
