import { Heading1 } from '@entur/typography'
import classes from './styles.module.css'
import { TBoard } from 'types/settings'
import dynamic from 'next/dynamic'
import { useReducer } from 'react'
import { settingsReducer } from './utils/reducer'
import {
    SettingsContext,
    SettingsDispatchContext,
    useBoardsSettings,
    useBoardsSettingsDispatch,
} from './utils/context'
import { Search } from './components/Search'
import { isEmpty } from 'lodash'
import { IllustratedInfo } from 'Admin/components/IllustratedInfo'
import { TableHeader } from './components/TableHeader'
import { TableRows } from './components/TableRows'
import { ToggleBoardsColumns } from './components/ToggleBoardsColumns'
import { TBoardsColumn } from 'Admin/types/boards'
import {
    useSensors,
    useSensor,
    PointerSensor,
    KeyboardSensor,
    DragEndEvent,
    DndContext,
    closestCenter,
} from '@dnd-kit/core'
import {
    sortableKeyboardCoordinates,
    arrayMove,
    SortableContext,
    horizontalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
    restrictToHorizontalAxis,
    restrictToWindowEdges,
} from '@dnd-kit/modifiers'

function Boards({ boards }: { boards: TBoard[] }) {
    const [settings, dispatch] = useReducer(settingsReducer, {
        search: '',
        sort: { type: 'descending', column: 'lastModified' },
        columns: ['name', 'url', 'actions', 'lastModified'],
        boards: boards,
    })

    return (
        <SettingsContext.Provider value={settings}>
            <SettingsDispatchContext.Provider value={dispatch}>
                <div className={classes.boards}>
                    <div className={classes.header}>
                        <Heading1>Mine Tavler</Heading1>
                    </div>
                    <div className={classes.actionRow}>
                        <Search />
                        <ToggleBoardsColumns />
                    </div>
                    <BoardTable />
                </div>
            </SettingsDispatchContext.Provider>
        </SettingsContext.Provider>
    )
}

function BoardTable() {
    const { boards, columns } = useBoardsSettings()
    const dispatch = useBoardsSettingsDispatch()

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    )

    if (isEmpty(boards))
        return (
            <IllustratedInfo
                title="Her var det tomt"
                description="Du har ikke laget noen Tavler ennå"
            />
        )

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event

        if (active.id !== over?.id) {
            const oldIndex = columns.indexOf(active.id as TBoardsColumn)
            const newIndex = columns.indexOf(over?.id as TBoardsColumn)
            const newOrder = arrayMove(columns, oldIndex, newIndex)
            dispatch({ type: 'setColumns', columns: newOrder })
        }
    }

    return (
        <div
            className={classes.boardTable}
            style={{
                gridTemplateColumns: `repeat(${columns.length},auto)`,
            }}
        >
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                modifiers={[restrictToHorizontalAxis, restrictToWindowEdges]}
            >
                <SortableContext
                    items={columns}
                    strategy={horizontalListSortingStrategy}
                >
                    <TableHeader columns={columns} />
                    <TableRows />
                </SortableContext>
            </DndContext>
        </div>
    )
}

const NonSSRAdmin = dynamic(() => Promise.resolve(Boards), { ssr: false })

export { NonSSRAdmin as Boards }
