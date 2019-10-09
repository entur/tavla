import React from 'react'
import './styles.scss'

const Checkbox = ({ id, value, onChange }: Props): JSX.Element => (
    <>
        <input
            type="checkbox"
            className="checkbox"
            id={id}
            key={id}
            value={value}
            onChange={() => onChange(id, 'stops')}
        />
        <label htmlFor={id}/>
    </>
)

interface Props {
    id: string,
    value: string,
    onChange: (id: string, type: 'stops') => void,
}

export default Checkbox
