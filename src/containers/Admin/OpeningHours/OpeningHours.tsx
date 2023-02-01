import React, { useState } from 'react'
import { AddIcon, DeleteIcon } from '@entur/icons'
import { Button, IconButton } from '@entur/button'
import { Checkbox, TextField, Switch } from '@entur/form'
import { useToast } from '@entur/alert'
import { TimePicker, nativeDateToTimeValue } from '@entur/datepicker'
import type {} from '@entur/datepicker'
import { Tile } from '../../../components/Tile/Tile'
import { useSettings } from '../../../settings/SettingsProvider'
import { TileHeader } from '../../../components/TileHeader/TileHeader'
import classes from './OpeningHours.module.scss'

const OpeningHours: React.FC = () => {
    const [settings, setSettings] = useSettings()
    const [location, setLocation] = useState('')
    const [openingHoursList, setOpeningHoursList] = useState<
        OpeningHoursType[]
    >(settings.openingHoursList)

    function updateOpenTimeField(date: any, index?: number) {
        //splitt opp date fra xx:xx:xx til xx:xx
        const splitted = date.toString().split(':')
        console.log(splitted[0] + ':' + splitted[1])
        const newList = openingHoursList?.map((innerElement, innerIndex) =>
            index !== innerIndex
                ? innerElement
                : {
                      ...innerElement,
                      opens: splitted[0] + ':' + splitted[1],
                  },
        )
    }

    //her tar man inn en STRING og får man en TIME tilbake
    function convertHourStringTotTimeValue(time: string) {
        const timeList = time.split(':')
        const timeInDateValue = new Date(
            Number(timeList[0]),
            Number(timeList[1]),
        )

        return nativeDateToTimeValue(timeInDateValue)
    }

    function updateCloseTimeField(date: string, index?: number) {
        //splitt opp date fra xx:xx:xx til xx:xx
        const splitted = date.toString().split(':')
        const newList = openingHoursList?.map((innerElement, innerIndex) =>
            index !== innerIndex
                ? innerElement
                : {
                      ...innerElement,
                      closes: splitted[0] + ':' + splitted[1],
                  },
        )
    }

    type OpeningHoursType = {
        day: string
        opens: string
        closes: string
        isClosed?: boolean
    }

    const { addToast } = useToast()

    function addEmptyListElement() {
        const obj: OpeningHoursType[] = [
            { day: '', opens: '', closes: '', isClosed: false },
        ]
        const newList = [...openingHoursList, ...obj]
        setOpeningHoursList(newList)
    }

    function updateDayField(
        e: React.ChangeEvent<HTMLInputElement>,
        index: number,
    ) {
        const newList = openingHoursList.map((innerElement, innerIndex) =>
            index !== innerIndex
                ? innerElement
                : {
                      ...innerElement,
                      day: e.target.value,
                  },
        )
        setOpeningHoursList(newList)
    }

    function removeRow(index: number) {
        const filteredList = openingHoursList.filter(
            (i) => i !== openingHoursList[index],
        )
        setOpeningHoursList(filteredList)
    }

    function makeClosed(checked: boolean, index?: number) {
        const newList = openingHoursList.map((innerElement, innerIndex) =>
            index !== innerIndex
                ? innerElement
                : {
                      ...innerElement,
                      isClosed: checked,
                  },
        )
        setOpeningHoursList(newList)
    }

    function submitOpeningHours() {
        console.log(openingHoursList)
        setSettings({ openingHoursList })
        setSettings({ openingHoursLocation: location })

        addToast({
            content: 'Åpningstidene er nå satt',
            variant: 'success',
        })
    }

    function handleShowOpeningHours() {
        setSettings({ showOpeningHours: !settings.showOpeningHours })
    }

    function addLocation(e: React.ChangeEvent<HTMLInputElement>) {
        setLocation(e.target.value)
    }

    return (
        <Tile className={classes.OpeningHourTile}>
            <div className={classes.HeaderWrapper}>
                <TileHeader title="Åpningstider for" />
                <div className={classes.InputWrapper}>
                    <TextField
                        label=""
                        className={classes.TextFieldLocation}
                        size="medium"
                        type="text"
                        defaultValue={settings.openingHoursLocation}
                        onChange={(e) => addLocation(e)}
                    />
                </div>
                <Switch
                    size="large"
                    onChange={handleShowOpeningHours}
                    checked={settings.showOpeningHours}
                />
            </div>
            <div className={classes.ListWrapper}>
                <ul className={classes.List}>
                    {openingHoursList.map((element, index: number) => (
                        <li className={classes.ListRow} key={index}>
                            <IconButton
                                className={classes.DeleteButton}
                                onClick={() => removeRow(index)}
                            >
                                <DeleteIcon />
                            </IconButton>
                            <TextField
                                className={classes.TextField}
                                label="Dag"
                                type="text"
                                value={element.day}
                                onChange={(e) => {
                                    updateDayField(e, index)
                                }}
                            ></TextField>
                            :
                            <TimePicker
                                selectedTime={null}
                                onChange={(e) =>
                                    updateOpenTimeField(e.toString(), index)
                                }
                                label="Åpner"
                                value={
                                    element.opens
                                        ? convertHourStringTotTimeValue(
                                              element.opens,
                                          )
                                        : undefined
                                }
                                disabled={element.isClosed}
                            />
                            <TimePicker
                                selectedTime={null}
                                onChange={(e) =>
                                    updateCloseTimeField(e.toString(), index)
                                }
                                label="Stenger"
                                value={
                                    element.closes
                                        ? convertHourStringTotTimeValue(
                                              element.closes,
                                          )
                                        : undefined
                                }
                                disabled={element.isClosed}
                            />
                            <div className={classes.ClosedWrapper}>
                                <Checkbox
                                    checked={element.isClosed}
                                    value={element.opens}
                                    title="Stengt"
                                    onChange={(e) =>
                                        makeClosed(e.target.checked, index)
                                    }
                                >
                                    Stengt
                                </Checkbox>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <div className={classes.ButtonsWrapper}>
                <IconButton onClick={() => addEmptyListElement()} size="medium">
                    <AddIcon />
                </IconButton>
                <Button
                    variant="primary"
                    size="medium"
                    className={classes.SubmitButton}
                    onClick={() => submitOpeningHours()}
                >
                    Lagre
                </Button>
            </div>
            {openingHoursList && (
                <>
                    {' '}
                    Åpner:{' '}
                    {openingHoursList[1]?.opens +
                        'and closes: ' +
                        openingHoursList[1]?.closes}{' '}
                </>
            )}
        </Tile>
    )
}

export { OpeningHours }
