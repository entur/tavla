import React from 'react'
import moment from 'moment'
import './styles.css'
import WhiteTavlaLogo from '../../assets/icons/whiteTavlaLogo.js'

class Header extends React.Component {
    state = {
        time: moment().format('HH:mm'),
    }

    componentDidMount() {
        this.timerID = setInterval(
            () => {
                const date = moment()
                const dayOfTheWeek = date.locale('nb').format('dddd')
                const dayNumber = date.date()
                const monthName = date.locale('nb').format('MMMM')

                this.setState({
                    date: dayOfTheWeek.charAt(0).toUpperCase() + dayOfTheWeek.slice(1) + ' ' + dayNumber + '. ' + monthName,
                    time: moment().format('HH:mm'),
                })
            },
            1000
        )
    }

    componentWillUnmount() {
        clearInterval(this.timerID)
    }

    render() {
        return (
            <div className="header">
                <WhiteTavlaLogo height={57} width={287}/>
                <div>
                    <div className="header-time">
                        {this.state.time}
                    </div>
                    <div className="header-date">
                        {this.state.date}
                    </div>
                </div>
            </div>
        )
    }
}

export default Header
