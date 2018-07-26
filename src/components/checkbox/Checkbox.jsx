import React from 'react'
import './styles.scss'

const Checkbox = ({ id, value, onChange }) => [
    <input
        type="checkbox"
        className="checkbox"
        id={id}
        value={value}
        onChange={() => onChange(id, 'stops')}
    />,
    <label htmlFor={id}/>,
]
export default Checkbox
