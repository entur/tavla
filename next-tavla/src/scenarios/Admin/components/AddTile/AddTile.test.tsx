import {
    findByLabelText,
    fireEvent,
    render,
    screen,
} from '@testing-library/react'
import '@testing-library/jest-dom'
import React, { useReducer } from 'react'
import {
    SettingsDispatchContext,
    settingsReducer,
} from 'scenarios/Admin/reducer'
import { AddTile } from './index'
import { TilesSettings } from '../TilesSettings'

jest.mock('nanoid', () => {
    return { nanoid: () => '1234' }
})

test('tests that SelectLines allow selection of lines', async () => {
    const TestComponent = () => {
        const [settings, dispatch] = useReducer(settingsReducer, {
            tiles: [],
        })

        return (
            <SettingsDispatchContext.Provider value={dispatch}>
                <TilesSettings tiles={settings.tiles} />
                <AddTile />
            </SettingsDispatchContext.Provider>
        )
    }

    render(<TestComponent />)
})
