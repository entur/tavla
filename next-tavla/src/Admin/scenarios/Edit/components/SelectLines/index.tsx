import { Checkbox } from '@entur/form'
import { TQuayTile, TStopPlaceTile } from 'types/tile'
import classes from './styles.module.css'
import { Heading4 } from '@entur/typography'
import { TLinesFragment } from 'graphql/index'
import { transportModeNames } from './utils'
import { TransportIcon } from 'Board/scenarios/Table/components/TransportIcon'
import { useToggledLines } from './hooks/useToggledLines'

function SelectLines({
    tile,
    lines,
}: {
    tile: TStopPlaceTile | TQuayTile
    lines: TLinesFragment['lines']
}) {
    const { linesByMode, toggleAllLinesForMode, toggleLine } =
        useToggledLines(lines)

    return (
        <div className={classes.selectLines}>
            <Heading4>Velg transportmidler og linjer</Heading4>
            <div className={classes.linesContainer}>
                {linesByMode.map(({ transportMode, lines }) => (
                    <div>
                        <div className={classes.transportTitle}>
                            <TransportIcon transport={transportMode} />
                            {transportModeNames[transportMode]}
                        </div>
                        <div className="flexRow alignCenter">
                            <Checkbox
                                onChange={() =>
                                    toggleAllLinesForMode(transportMode)
                                }
                            />
                            Velg alle
                        </div>
                        {lines.map((line) => (
                            <div className="flexRow alignCenter pl-3 g-1">
                                <Checkbox onChange={() => toggleLine(line)} />
                                <PublicCode publicCode={line.publicCode} />{' '}
                                {line.name}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )
}

function PublicCode({ publicCode }: { publicCode: string | null }) {
    return <div className={classes.publicCode}>{publicCode}</div>
}

export { SelectLines }
