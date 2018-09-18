import React from 'react'
import moment from 'moment'
import './styles.scss'
import '../../components/header/styles.scss'
import BackButton from '../../components/backButton/BackButton.jsx'

class AdminHeader extends React.Component {
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
        const { goBackToDashboard } = this.props
        return (
            <div className="header header-container">
                <div className="admin-header">
                    <BackButton className="admin-header--back-button" action={goBackToDashboard} />
                    <p>Rediger tavle</p>
                </div>
                <div className="header-container--data-and-clock">
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

export default AdminHeader
