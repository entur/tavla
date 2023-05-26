import { fireEvent, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import React, { useReducer } from 'react'
import {
    SettingsDispatchContext,
    settingsReducer,
} from 'scenarios/Admin/reducer'
import { SelectLines } from './index'
import { TStopPlaceTile } from 'types/tile'

test('tests that SelectLines allow selection of lines', async () => {
    const TestComponent = () => {
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
                            size: 2,
                            type: 'destination',
                        },
                        {
                            type: 'time',
                        },
                    ],
                    placeId: 'NSR:StopPlace:60066',
                    type: 'stop_place',
                    uuid: '1683625543293',
                },
            ],
        })

        const lines = [
            {
                id: 'ATB:Line:2_25',
                publicCode: '25',
                name: 'Vikåsen- Strindheim- Singsaker',
            },
            {
                id: 'ATB:Line:2_805',
                publicCode: '805',
                name: 'Trondheim - Brekstad',
            },
            {
                id: 'ATB:Line:2_800',
                publicCode: '800',
                name: 'Trondheim - Brekstad - Kristiansund',
            },
            {
                id: 'ATB:Line:2_810',
                publicCode: '810',
                name: 'Trondheim - Vanvikan',
            },
        ]

        return (
            <SettingsDispatchContext.Provider value={dispatch}>
                <SelectLines
                    tile={settings.tiles[0] as TStopPlaceTile}
                    lines={lines}
                />
            </SettingsDispatchContext.Provider>
        )
    }

    render(<TestComponent />)

    // SelectLines has not been expanded yet
    expect(
        await screen.findByRole('button', { expanded: false }),
    ).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button'))

    // SelectLines has been expanded
    expect(
        await screen.findByRole('button', { expanded: true }),
    ).toBeInTheDocument()

    // No lines has been selected yet
    await screen.findAllByRole('checkbox').then((res) =>
        res.forEach((checkbox) => {
            expect(checkbox).not.toBeChecked()
        }),
    )

    fireEvent.click(screen.getByLabelText('805 Trondheim - Brekstad'))

    // Verify that a line has been selected
    expect(
        await screen.findByLabelText('805 Trondheim - Brekstad'),
    ).toBeChecked()
})
