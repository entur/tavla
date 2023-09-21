import { DEFAULT_BOARD_NAME } from 'Admin/utils/constants'

function Name({ name = DEFAULT_BOARD_NAME }: { name?: string }) {
    return <div>{name}</div>
}

export { Name }
