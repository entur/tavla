import { Heading1 } from '@entur/typography'
import classes from './styles.module.css'
import { TBoard } from 'types/settings'
import dynamic from 'next/dynamic'
import { CreateBoard } from '../CreateBoard'
import { useReducer } from 'react'
import { settingsReducer } from './utils/reducer'
import {
    SettingsContext,
    SettingsDispatchContext,
    useBoardsSettings,
} from './utils/context'
import { Search } from './components/Search'
import { isEmpty } from 'lodash'
import { IllustratedInfo } from 'Admin/components/IllustratedInfo'
import { TableHeader } from './components/TableHeader'
import { TableRows } from './components/TableRows'

function Boards({ boards }: { boards: TBoard[] }) {
    const [settings, dispatch] = useReducer(settingsReducer, {
        search: '',
        sort: { type: 'ascending', column: 'name' },
        columns: ['name', 'url', 'actions', 'modified'],
        boards: boards,
    })

    return (
        <SettingsContext.Provider value={settings}>
            <SettingsDispatchContext.Provider value={dispatch}>
                <div className={classes.boards}>
                    <div className={classes.header}>
                        <Heading1>Mine Tavler</Heading1>
                        <CreateBoard />
                    </div>
                    <Search />
                    <BoardTable />
                </div>
            </SettingsDispatchContext.Provider>
        </SettingsContext.Provider>
    )
}

function BoardTable() {
    const settings = useBoardsSettings()

    if (isEmpty(settings.boards))
        return (
            <IllustratedInfo
                title="Her var det tomt"
                description="Du har ikke laget noen Tavler ennå"
            />
        )

    return (
        <div
            className={classes.boardTable}
            style={{
                gridTemplateColumns: `repeat(${settings.columns.length},auto)`,
            }}
        >
            <TableHeader columns={settings.columns} />
            <TableRows />
        </div>
    )
}

const NonSSRAdmin = dynamic(() => Promise.resolve(Boards), { ssr: false })

export { NonSSRAdmin as Boards }
