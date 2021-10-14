import React from 'react'
import ReactDOM from 'react-dom'

import 'react-app-polyfill/stable'

import { createBrowserHistory } from 'history'

import './main.scss'

import App from './containers/App'

const history = createBrowserHistory()

ReactDOM.render(<App history={history} />, document.getElementById('app'))
