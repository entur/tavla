import { TBoard } from 'types/settings'
import { useReducer } from 'react'
import classes from './styles.module.css'
import dynamic from 'next/dynamic'
import { SecondaryButton } from '@entur/button'
import { CopyIcon, ExternalIcon } from '@entur/icons'
import { useToast } from '@entur/alert'
import { boardReducer } from './utils/reducer'
import { SettingsDispatchContext } from './utils/contexts'
import { AddTile } from './components/AddTile'
import { DeleteBoard } from './components/DeleteBoard'
import { TilesOverview } from './components/TilesOverview'
import { Heading1, Heading3 } from '@entur/typography'
import { BoardSettings } from './components/BoardSettings'
import { useAutoSaveBoard } from './hooks/useAutoSaveBoard'
import { Preview } from './components/Preview'
import Link from 'next/link'
import { useLink } from '../Boards/hooks/useLink'

function Edit({ initialBoard }: { initialBoard: TBoard }) {
    const [board, dispatch] = useReducer(boardReducer, initialBoard)
    const { addToast } = useToast()

    const link = useLink(board.id)

    useAutoSaveBoard(board)

    const addTile = (
        name: string,
        placeId: string,
        type: 'quay' | 'stop_place',
    ) => {
        dispatch({
            type: 'addTile',
            tile: {
                type,
                placeId,
                name,
            },
        })
    }

    return (
        <SettingsDispatchContext.Provider value={dispatch}>
            <div className={classes.settings}>
                <div className="flexRow justifyBetween mt-4">
                    <Heading1 className="m-0 text-rem-4">
                        Rediger tavlevisning
                    </Heading1>
                    <div className="flexRow g-2">
                        <SecondaryButton
                            as={Link}
                            aria-label="Åpne tavla"
                            href={link ?? '/'}
                            target="_blank"
                        >
                            Åpne tavla
                            <ExternalIcon />
                        </SecondaryButton>

                        <SecondaryButton
                            onClick={() => {
                                navigator.clipboard.writeText(link ?? '')
                                addToast('Lenke til Tavla kopiert')
                            }}
                        >
                            Kopier lenke til Tavla
                            <CopyIcon />
                        </SecondaryButton>
                        <DeleteBoard board={board} />
                    </div>
                </div>
                <BoardSettings board={board} />
                <Preview board={board} />
                <div>
                    <Heading3 className="m-0">Stoppesteder i tavla</Heading3>
                    <AddTile addTile={addTile} />
                </div>
                <TilesOverview tiles={board.tiles} />
            </div>
        </SettingsDispatchContext.Provider>
    )
}

// No SSR for Admin to fix hydration issues
// caused by incompatible libraries (dnd-kit, @entur/dropdown)
// https://github.com/clauderic/dnd-kit/issues/801
const NonSSRAdmin = dynamic(() => Promise.resolve(Edit), { ssr: false })

export { NonSSRAdmin as Edit }
