import React, { useState } from 'react'
import { Multiselect } from 'multiselect-react-dropdown'
import { TimePicker } from '@entur/datepicker'
import { AddIcon, CheckIcon, DeleteIcon } from '@entur/icons'
import { IconButton } from '@entur/button'
import { TileHeader } from '../../../components/TileHeader/TileHeader'
import { Tile } from '../../../components/Tile/Tile'
import classes from './OpeningHours.module.scss'
import { Checkbox, Switch } from '@entur/form'

const OpeningHours: React.FC = () => {
    const [startTimeHour, setStartTimeHour] = useState([0, 0])
    const [stopTimeHour, setStopTimeHour] = useState([0, 0])

    const [closedDays, setClosedDays] = useState<boolean | undefined>(false)

    const [chosenDayss, setChosenDayss] = useState([])

    const [daysTimePair, setDaysTimePair] = useState<number[][][]>()

    const weekdays = [
        { name: 'Mandag', id: 1 },
        { name: 'Tirsdag', id: 2 },
        { name: 'Onsdag', id: 3 },
        { name: 'Torsdag', id: 4 },
        { name: 'Fredag', id: 5 },
        { name: 'Lørdag', id: 6 },
        { name: 'Søndag', id: 7 },
    ]

    type DagTidObject = {
        dager?: number[]
        startTid: number[]
        sluttTid: number[]
        open?: boolean
    }

    function setDagTidObject(listElement: any) {
        const exampleList = [
            [
                [1, 2, 3],
                [9, 0],
                [16, 0],
            ],
            [
                [6, 7],
                [10, 30],
                [15, 30],
            ],
        ]
        setDaysTimePair(exampleList)
    }

    function addNewListElement() {
        var ul = document.getElementById('liste')
        var newElement = document.createElement('li')
        newElement.setAttribute('className', classes.OpeningHoursElement)
        newElement.appendChild(document.createTextNode('hei'))
        ul?.appendChild(newElement)
    }

    return (
        <Tile>
            <div className={classes.Header}>
                <TileHeader title="Åpningstider" /> <Switch size="large" />
            </div>
            <div>
                <ul>
                    {daysTimePair?.map((listeElement) => (
                        <li>{listeElement}</li>
                    ))}
                </ul>

                <ul id="liste">
                    <li className={classes.OpeningHoursElement}>
                        <Multiselect
                            avoidHighlightFirstOption
                            className={classes.DayPicker}
                            displayValue="name"
                            options={weekdays}
                            placeholder="Dager"
                            hidePlaceholder
                            onSelect={(selected) => {
                                setChosenDayss(
                                    selected.map((i: any) => {
                                        setDagTidObject(selected)
                                        return i.id
                                    }),
                                )
                            }}
                            onRemove={(selected) => {
                                setChosenDayss(
                                    selected.map((i: any) => {
                                        setDagTidObject(i)
                                        return i.id
                                    }),
                                )
                            }}
                        />
                        <TimePicker
                            className={classes.TimePicker}
                            label="Åpner"
                            selectedTime={null}
                            onChange={(time) => {
                                setStartTimeHour([time.hour, time.minute])
                            }}
                            disabled={closedDays}
                        />
                        <TimePicker
                            className={classes.TimePicker}
                            label="Stenger"
                            selectedTime={null}
                            onChange={(time) => {
                                console.log(time.minute)
                                setStopTimeHour([time.hour, time.minute])
                            }}
                            disabled={closedDays}
                        />
                        <Checkbox
                            onClick={() => {
                                setStartTimeHour([0, 0])
                                setStopTimeHour([0, 0])
                                setClosedDays(!closedDays)
                            }}
                        >
                            Stengt
                        </Checkbox>
                    </li>
                </ul>
                <IconButton>
                    <AddIcon onClick={() => setDagTidObject} />
                </IconButton>
            </div>
        </Tile>
    )
}

export { OpeningHours }
