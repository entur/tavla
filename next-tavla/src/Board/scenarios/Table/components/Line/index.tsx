import { TTransportMode } from 'types/graphql-schema'
import { TableColumn } from '../TableColumn'
import { TableRow } from '../TableRow'

function Line({
    lines,
}: {
    lines: { transportMode: TTransportMode; publicCode: string; key: string }[]
}) {
    return (
        <TableColumn title="Linje">
            {lines.map((line) => (
                <TableRow key={line.key}>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            height: '100%',
                            padding: '0.5em',
                            color: 'var(--main-background-color)',
                            backgroundColor: `var(--table-transport-${
                                line.transportMode ?? 'unknown'
                            }-color)`,
                            borderRadius: '0.2em',
                            fontWeight: 700,
                        }}
                    >
                        {line.publicCode}
                    </div>
                </TableRow>
            ))}
        </TableColumn>
    )
}

export { Line }
