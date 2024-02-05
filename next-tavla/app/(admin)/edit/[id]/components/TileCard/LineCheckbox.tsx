import { Checkbox } from '@entur/form'
import { TLineFragment } from 'Admin/scenarios/Edit/components/SelectLines/types'
import { TTransportMode } from 'types/graphql-schema'
import { TTile } from 'types/tile'
import classes from './styles.module.css'

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
            className="pl-3"
        >
            <div className="flexRow alignCenter g-1">
                <PublicCode publicCode={line.publicCode} />
                {line.name}
            </div>
        </Checkbox>
    )
}
function PublicCode({ publicCode }: { publicCode: string | null }) {
    return <div className={classes.publicCode}>{publicCode}</div>
}
export { LineCheckbox }
