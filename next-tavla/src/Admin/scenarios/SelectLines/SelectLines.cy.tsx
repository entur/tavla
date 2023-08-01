import React, { useReducer } from 'react'
import { SelectLines } from './index'
import { SettingsDispatchContext } from 'Admin/utils/contexts'
import { settingsReducer } from '../Edit/reducer'
import { TLinesFragment } from 'graphql/index'

describe('<SelectLines />', () => {
    const TestComponent = () => {
        const [settings, dispatch] = useReducer(settingsReducer, {
            tiles: [
                {
                    columns: ['line', 'destination', 'time'],
                    placeId: 'NSR:StopPlace:60066',
                    type: 'stop_place',
                    uuid: '1683625543293',
                },
            ],
        })

        const lines: TLinesFragment['lines'] = [
            {
                id: 'ATB:Line:2_25',
                publicCode: '25',
                name: 'Vikåsen- Strindheim- Singsaker',
                transportMode: 'bus',
            },
            {
                id: 'ATB:Line:2_805',
                publicCode: '805',
                name: 'Trondheim - Brekstad',
                transportMode: 'bus',
            },
            {
                id: 'ATB:Line:2_800',
                publicCode: '800',
                name: 'Trondheim - Brekstad - Kristiansund',
                transportMode: 'bus',
            },
            {
                id: 'ATB:Line:2_810',
                publicCode: '810',
                name: 'Trondheim - Vanvikan',
                transportMode: 'bus',
            },
        ]

        return (
            <SettingsDispatchContext.Provider value={dispatch}>
                {settings.tiles.map((tile) =>
                    tile.type === 'stop_place' ? (
                        <SelectLines
                            key={tile.uuid}
                            tile={tile}
                            lines={lines}
                        />
                    ) : null,
                )}
            </SettingsDispatchContext.Provider>
        )
    }

    it('renders', () => {
        cy.mount(<TestComponent />)
    })

    it('can select lines', () => {
        cy.mount(<TestComponent />)
        cy.contains('label', '805 Trondheim - Brekstad')
            .get('input')
            .should('not.be.checked')
        cy.contains('805 Trondheim - Brekstad').click()
        cy.contains('label', '805 Trondheim - Brekstad')
            .get('input')
            .should('be.checked')
    })
})
