import { DEFAULT_BOARD_NAME } from 'Admin/utils/constants'
import { Column } from './Column'

function Name({ name = DEFAULT_BOARD_NAME }: { name?: string }) {
    return <Column column="name">{name}</Column>
}

export { Name }
