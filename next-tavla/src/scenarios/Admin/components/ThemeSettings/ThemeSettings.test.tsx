import { fireEvent, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ThemeSettings } from './index'
import { TTheme } from 'types/settings'
import React, { useReducer } from 'react'
import {
    SettingsDispatchContext,
    settingsReducer,
} from 'scenarios/Admin/reducer'

test('tests that theme picker changes value correctly', async () => {
    const TestComponent = () => {
        const [settings, dispatch] = useReducer(settingsReducer, {
            theme: 'default' as TTheme,
            tiles: [],
        })

        return (
            <SettingsDispatchContext.Provider value={dispatch}>
                <ThemeSettings theme={settings.theme} />
            </SettingsDispatchContext.Provider>
        )
    }

    render(<TestComponent />)

    expect(await screen.findByDisplayValue('default')).toBeChecked()
    expect(await screen.findByDisplayValue('dark')).not.toBeChecked()

    fireEvent.click(screen.getByDisplayValue('dark'))

    expect(await screen.findByDisplayValue('default')).not.toBeChecked()
    expect(await screen.findByDisplayValue('dark')).toBeChecked()
})
