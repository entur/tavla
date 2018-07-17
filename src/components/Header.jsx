import React from 'react'
import moment from 'moment'

class Header extends React.Component {
    state = {
        time: moment().format('HH:mm'),
    }

    componentDidMount() {
        this.timerID = setInterval(
            () => this.tick(),
            1000
        )
    }

    componentWillUnmount() {
        clearInterval(this.timerID)
    }

    tick() {
        this.setState({
            time: moment().format('HH:mm'),
        })
    }


    render() {
        return (
            <div className="header">
                <h1>{this.state.time}</h1>
            </div>
        )
    }
}

export default Header
