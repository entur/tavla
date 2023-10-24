import { TagChip } from '@entur/chip'
import { TTile } from 'types/tile'
import { useCreateBoardDispatch } from '../utils/context'

export function StopPlaceChip({ tile }: { tile: TTile }) {
    const dispatch = useCreateBoardDispatch()
    return (
        <div className="flexRow g-2 pt-2 pb-2">
            <TagChip
                onClose={() => {
                    dispatch({
                        type: 'removeTile',
                        tileId: tile.uuid,
                    })
                }}
            >
                {tile.name}
            </TagChip>
        </div>
    )
}
