import { fireEvent, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ThemeSettings } from './ThemeSettings'
import { TTheme } from 'types/settings'
import { useState } from 'react'

test('tests that theme picker changes value correctly', async () => {
    const TestComponent = () => {
        const [theme, setTheme] = useState<TTheme>('default')

        return <ThemeSettings theme={theme} setTheme={setTheme} />
    }
    render(<TestComponent />)

    expect(await screen.findByDisplayValue('default')).toBeChecked()
    expect(await screen.findByDisplayValue('dark')).not.toBeChecked()

    fireEvent.click(screen.getByDisplayValue('dark'))

    expect(await screen.findByDisplayValue('default')).not.toBeChecked()
    expect(await screen.findByDisplayValue('dark')).toBeChecked()
})
