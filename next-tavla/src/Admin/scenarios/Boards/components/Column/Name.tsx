import { DEFAULT_BOARD_NAME } from 'Admin/utils/constants'
import { SortableColumn } from './SortableColumn'

function Name({ name = DEFAULT_BOARD_NAME }: { name?: string }) {
    return <SortableColumn column="name">{name}</SortableColumn>
}

export { Name }
