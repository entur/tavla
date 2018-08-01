import React from 'react'
import moment from 'moment'
import './styles.css'

class Header extends React.Component {
    state = {
        time: moment().format('HH:mm'),
    }

    componentDidMount() {
        this.timerID = setInterval(
            () => this.setState({
                time: moment().format('HH:mm'),
            }),
            1000
        )
    }

    componentWillUnmount() {
        clearInterval(this.timerID)
    }

    render() {
        return (
            <div className="header">
                {this.props.settingsButton}
                {this.state.time}
            </div>
        )
    }
}

export default Header
