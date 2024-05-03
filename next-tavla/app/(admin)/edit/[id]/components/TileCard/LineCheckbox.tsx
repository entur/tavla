import { Checkbox } from '@entur/form'
import { TTransportMode } from 'types/graphql-schema'
import { TTile } from 'types/tile'
import { TLineFragment } from './types'

function LineCheckbox({
    tile,
    line,
    transportMode,
}: {
    tile: TTile
    line: TLineFragment
    transportMode: TTransportMode | null
}) {
    return (
        <Checkbox
            name={`${tile.uuid}-${transportMode}`}
            defaultChecked={
                !tile.whitelistedLines ||
                tile.whitelistedLines.length === 0 ||
                tile.whitelistedLines.includes(line.id)
            }
            key={line.id}
            value={line.id}
            className="pl-6"
        >
            <div className="flex flex-row items-center gap-1">
                {line.publicCode && <PublicCode publicCode={line.publicCode} />}
                {line.name}
            </div>
        </Checkbox>
    )
}
function PublicCode({ publicCode }: { publicCode: string | null }) {
    return <div className="publicCode">{publicCode}</div>
}
export { LineCheckbox }
