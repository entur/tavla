import React from 'react'
import { SlideSwitch } from '@entur/component-library'
import { getIcon } from '../../../utils'

class TransportRow extends React.Component {
    state = {
        checked: true,
    }

    handleOnChecked(mode, transportModes) {
        this.props.updateHiddenList(mode, transportModes)
        this.setState({
            checked: !this.state.checked,
        })
    }

    componentDidMount() {
        this.props.hiddenModes.forEach(mode => {
            if (mode === this.props.mode) {
                this.setState({
                    checked: false,
                })
            }
        })
    }

    getTransportModeTitle(type) {
        switch (type) {
            case 'bus':
                return 'Buss'
            case 'tram':
                return 'Trikk'
            case 'bike':
                return 'Bysykkel'
            case 'water':
                return 'Ferje'
            case 'rail':
                return 'Tog'
            case 'metro':
                return 'T-bane'
            default:
                return type
        }
    }

    render() {
        const { mode, index } = this.props

        return (
            <div className="mode-sort-row">
                <div className="sort-button-item" key={index}>
                    <div
                        className="mode-sort-button"
                    >
                        { getIcon(mode, { height: 35, width: 35, className: 'mode-sort-icon' }) }
                    </div>
                    <p className="mode-sort-text">{this.getTransportModeTitle(mode)}</p>
                </div>
                <SlideSwitch
                    id="SlideSwitch"
                    className="mode-sort-slide-switch"
                    onChange={() => { this.handleOnChecked(mode, 'transportModes') }}
                    checked={this.state.checked}
                    style={{ cursor: 'pointer' }}
                />
            </div>)
    }
}

export default TransportRow
