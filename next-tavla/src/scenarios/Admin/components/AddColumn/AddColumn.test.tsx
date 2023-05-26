import { fireEvent, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { AddColumn } from './index'
import React, { useReducer } from 'react'
import {
    SettingsDispatchContext,
    settingsReducer,
} from 'scenarios/Admin/reducer'
import { TColumn, TStopPlaceTile } from 'types/tile'

test('tests that addColumn adds a new column to a tile', async () => {
    const AddColumnTest = () => {
        const [settings, dispatch] = useReducer(settingsReducer, {
            tiles: [
                {
                    columns: [
                        {
                            type: 'platform',
                        },
                        {
                            type: 'line',
                        },
                        {
                            type: 'time',
                        },
                    ],
                    placeId: 'NSR:StopPlace:60066',
                    type: 'stop_place',
                    uuid: '123',
                },
            ],
        })

        const tile = settings.tiles[0] as TStopPlaceTile

        const addColumn = (newColumn: TColumn) => {
            dispatch({
                type: 'addColumn',
                tileId: tile.uuid,
                column: newColumn,
            })
        }

        if (!tile.columns) return null

        return (
            <SettingsDispatchContext.Provider value={dispatch}>
                <AddColumn
                    selectedColumns={tile.columns.map(
                        ({ type }: { type: TColumn }) => type,
                    )}
                    addColumn={addColumn}
                />
            </SettingsDispatchContext.Provider>
        )
    }

    render(<AddColumnTest />)

    expect(await screen.findByLabelText('Destinasjon')).not.toBeChecked()

    fireEvent.click(screen.getByLabelText('Destinasjon'))

    expect(await screen.findByLabelText('Destinasjon')).toBeChecked()

    fireEvent.click(screen.getByRole('button'))

    // Destination should disappear after being added
    expect(screen.queryByLabelText('Destinasjon')).not.toBeInTheDocument()
})
