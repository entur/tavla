import React, { useState } from 'react'
import { AddIcon, DeleteIcon } from '@entur/icons'
import { Button, IconButton } from '@entur/button'
import { Checkbox, TextField, Switch } from '@entur/form'
import { useToast } from '@entur/alert'
import { Tile } from '../../../components/Tile/Tile'
import { useSettings } from '../../../settings/SettingsProvider'
import { TileHeader } from '../../../components/TileHeader/TileHeader'
import classes from './OpeningHours.module.scss'

const OpeningHours: React.FC = () => {
    const [settings, setSettings] = useSettings()

    const [simpleDayTimeList, setSimpleDayTimeList] = useState<
        SimpleDayTimeType[]
    >(settings.openingHours)

    type SimpleDayTimeType = {
        day: string
        openingHours: string
        isClosed?: boolean
    }

    function addEmptyListElement() {
        const obj: SimpleDayTimeType[] = [{ day: '', openingHours: '' }]
        const newList = [...simpleDayTimeList, ...obj]
        setSimpleDayTimeList(newList)
    }

    function updateDayTimeListDay(
        e: React.ChangeEvent<HTMLInputElement>,
        index: number,
    ) {
        const newList = simpleDayTimeList.map((innerElement, innerIndex) =>
            index !== innerIndex
                ? innerElement
                : {
                      ...innerElement,
                      day: e.target.value,
                  },
        )
        setSimpleDayTimeList(newList)
    }

    function updateDayTimeListHours(
        e: React.ChangeEvent<HTMLInputElement>,
        index: number,
    ) {
        const newList = simpleDayTimeList.map((innerElement, innerIndex) =>
            index !== innerIndex
                ? innerElement
                : {
                      ...innerElement,
                      openingHours: e.target.value,
                  },
        )
        setSimpleDayTimeList(newList)
    }

    function removeRow(index: number) {
        const filteredList = simpleDayTimeList.filter(
            (i) => i !== simpleDayTimeList[index],
        )
        setSimpleDayTimeList(filteredList)
    }

    function makeClosed(checked: boolean, index: number) {
        const newList = simpleDayTimeList.map((innerElement, innerIndex) =>
            index !== innerIndex
                ? innerElement
                : {
                      ...innerElement,
                      isClosed: checked,
                  },
        )
        setSimpleDayTimeList(newList)
    }

    function submitOpeningHours() {
        setSettings({ openingHours: simpleDayTimeList })

        addToast({
            content: 'Åpningstidene er nå satt',
            variant: 'success',
        })
    }

    const { addToast } = useToast()

    function handleShowOpeningHours() {
        setSettings({ showOpeningHours: !settings.showOpeningHours })
    }

    return (
        <Tile className={classes.OpeningHourTile}>
            <div className={classes.HeaderWrapper}>
                <TileHeader title="Åpningstider" />
                <Switch
                    size="large"
                    onChange={handleShowOpeningHours}
                    checked={settings.showOpeningHours}
                />
            </div>
            <div className={classes.ListWrapper}>
                <ul className={classes.List}>
                    {simpleDayTimeList.map((element, index: number) => (
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
                                    updateDayTimeListDay(e, index)
                                }}
                            ></TextField>
                            :
                            <TextField
                                className={classes.TextField}
                                label="Åpningstider"
                                value={element.openingHours}
                                onChange={(e) => {
                                    updateDayTimeListHours(e, index)
                                }}
                                type="text"
                                disabled={element.isClosed}
                            ></TextField>
                            <div className={classes.ClosedWrapper}>
                                <Checkbox
                                    checked={element.isClosed}
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
                <div className={classes.ButtonsWrapper}>
                    <IconButton
                        onClick={() => addEmptyListElement()}
                        size="medium"
                    >
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
            </div>
        </Tile>
    )
}

export { OpeningHours }
