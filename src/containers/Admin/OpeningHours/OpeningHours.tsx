import React, { useState } from 'react'
import { AddIcon, DeleteIcon } from '@entur/icons'
import { IconButton } from '@entur/button'
import { TileHeader } from '../../../components/TileHeader/TileHeader'
import { Tile } from '../../../components/Tile/Tile'
import classes from './OpeningHours.module.scss'
import { Checkbox, TextField } from '@entur/form'
import { Switch } from '@entur/form'
import '@entur/form/dist/styles.css'

const OpeningHours: React.FC = () => {
    const [simpleDayTimeList, setSimpleDayTimeList] = useState<
        SimpleDayTimeType[]
    >([{ day: '', openingHours: '', isClosed: false }])

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

    function updateDayTimeListDay(e: any, index: any) {
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

    function updateDayTimeListHours(e: any, index: any) {
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

    function removeRow(index: any) {
        const filteredList = simpleDayTimeList.filter(
            (i) => i !== simpleDayTimeList[index],
        )
        setSimpleDayTimeList(filteredList)
    }

    function makeClosed(checked: boolean, index: any) {
        const newList = simpleDayTimeList.map((innerElement, innerIndex) =>
            index !== innerIndex
                ? innerElement
                : {
                      ...innerElement,
                      isClosed: checked,
                      openingHours: '',
                  },
        )
        setSimpleDayTimeList(newList)
    }

    return (
        <Tile className={classes.OpeningHourTile}>
            <div className={classes.HeaderWrapper}>
                <TileHeader title="Åpningstider" />
                <Switch size='large'/>
            </div>
            <div className={classes.ListWrapper}>
                <ul className={classes.List}>
                    {simpleDayTimeList.map((element, index: number) => (
                        // eslint-disable-next-line react/jsx-key
                        <li className={classes.ListRow}>
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
                                onChange={(e) => {
                                    updateDayTimeListHours(e, index)
                                }}
                                type="text"
                            ></TextField>
                            <div className={classes.ClosedWrapper}>
                                <Checkbox
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
                <IconButton onClick={() => addEmptyListElement()} size="medium">
                    <AddIcon />
                </IconButton>
                <div></div>
            </div>
        </Tile>
    )
}

export { OpeningHours }
