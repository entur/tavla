import { TBoard } from 'types/settings'
import { useReducer } from 'react'
import classes from './styles.module.css'
import dynamic from 'next/dynamic'
import { SecondaryButton } from '@entur/button'
import { CopyIcon } from '@entur/icons'
import { SecondaryLink } from 'components/SecondaryLink'
import { useToast } from '@entur/alert'
import { boardReducer } from './utils/reducer'
import { SettingsDispatchContext } from './utils/contexts'
import { AddTile } from './components/AddTile'
import { DeleteBoard } from './components/DeleteBoard'
import { TilesOverview } from './components/TilesOverview'
import { Heading1 } from '@entur/typography'
import { BoardSettings } from './components/BoardSettings'
import { useAutoSaveBoard } from './hooks/useAutoSaveBoard'
import { SaveStatus } from './components/SaveStatus'

function Edit({
    initialBoard,
    documentId,
}: {
    initialBoard: TBoard
    documentId: string
}) {
    const [board, dispatch] = useReducer(boardReducer, initialBoard)
    const { addToast } = useToast()

    const linkUrl = window.location.host + '/' + documentId

    useAutoSaveBoard(board)

    return (
        <SettingsDispatchContext.Provider value={dispatch}>
            <div className={classes.settings}>
                <div className="flexRow justifyBetween">
                    <Heading1>Innstillinger for tavla</Heading1>
                    <div className="flexRow g-2">
                        <SecondaryButton
                            onClick={() => {
                                navigator.clipboard.writeText(linkUrl)
                                addToast('Lenke til Tavla kopiert')
                            }}
                        >
                            Kopier lenke til Tavla
                            <CopyIcon />
                        </SecondaryButton>
                        <SecondaryLink
                            external
                            href={'/' + documentId}
                            text="Se Tavla"
                        />
                        <DeleteBoard board={board} />
                    </div>
                </div>
                <SaveStatus board={board} />
                <BoardSettings board={board} />
                <AddTile />
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
