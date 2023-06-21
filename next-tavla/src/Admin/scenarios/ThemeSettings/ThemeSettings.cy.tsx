import { Contrast } from '@entur/layout'
import React, { useReducer } from 'react'
import { ThemeSettings } from './index'
import { SettingsDispatchContext } from 'Admin/utils/contexts'
import { settingsReducer } from '../Edit/reducer'

describe('<ThemeSettings />', () => {
    const TestComponent = () => {
        const [settings, dispatch] = useReducer(settingsReducer, {
            tiles: [],
        })

        return (
            <Contrast>
                <SettingsDispatchContext.Provider value={dispatch}>
                    <ThemeSettings theme={settings.theme} />
                </SettingsDispatchContext.Provider>
            </Contrast>
        )
    }
    it('renders', () => {
        cy.mount(<TestComponent />)
    })

    it('can change theme', () => {
        cy.mount(<TestComponent />)
        cy.findByRole('radio', { name: 'Entur' }).should('be.checked')
        cy.findByRole('radio', { name: 'Lyst' }).should('not.be.checked')

        cy.findByRole('radio', { name: 'Lyst' }).parent().click()

        cy.findByRole('radio', { name: 'Entur' }).should('not.be.checked')
        cy.findByRole('radio', { name: 'Lyst' }).should('be.checked')
    })
})
