import React from 'react'
import {
    Route, Switch, Redirect,
} from 'react-router-dom'
import './main.scss'
import DepartureBoard from './containers/departureBoard/DepartureBoard'
import AdminPage from './containers/adminPage/AdminPage'
import App from './containers/App'

// const Layout = ({ children }) => (
//     <div className="main-container">
//         {children}
//     </div>
// )


class Layout extends React.Component {
    state = {
        stops: [],
    }

    render() {
        return (
            <div className="main-container">
                <Route path="/dashboard" render={(props) => <DepartureBoard {...props} stops={this.state.stops} /> } />
                <Route path="/admin" render={(props) => <AdminPage {...props} stops={this.state.props} />} />
            </div>
        )
    }
}


export const routes = (
    <div className="App">
        <Switch>
            <Route exact path="/" component={App} />
            <Layout>
                <Route path="/dashboard" render={(props) => <DepartureBoard {...props} stops={this.state.stops} /> } />
                <Route path="/admin" component={AdminPage} />
            </Layout>
            <Redirect to="/" />
        </Switch>
    </div>
)
