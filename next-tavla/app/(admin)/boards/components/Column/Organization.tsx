import { DEFAULT_BOARD_NAME } from 'app/(admin)/utils/constants'
import { Column } from './Column'

function Organization({
    organization = DEFAULT_BOARD_NAME,
}: {
    organization?: string
}) {
    return <Column column="organization">{organization}</Column>
}

export { Organization }
