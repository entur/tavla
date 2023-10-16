import { DEFAULT_BOARD_NAME } from 'Admin/utils/constants'
import { DraggableColumn } from './DraggableColumn'

function Name({ name = DEFAULT_BOARD_NAME }: { name?: string }) {
    return <DraggableColumn column="name">{name}</DraggableColumn>
}

export { Name }
