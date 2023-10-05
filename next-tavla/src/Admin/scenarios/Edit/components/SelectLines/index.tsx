import { TQuayTile, TStopPlaceTile } from 'types/tile'
import classes from './styles.module.css'
import { Heading4 } from '@entur/typography'
import { TLinesFragment } from 'graphql/index'
import { transportModeNames } from './utils'
import { TransportIcon } from 'Board/scenarios/Table/components/TransportIcon'
import { useToggledLines } from './hooks/useToggledLines'
import { Checkbox } from '@entur/form'

function SelectLines({
    tile,
    lines,
}: {
    tile: TStopPlaceTile | TQuayTile
    lines: TLinesFragment['lines']
}) {
    const {
        linesByMode,
        isAllLinesForModeToggled,
        toggleAllLinesForMode,
        toggleLine,
        isLineToggled,
    } = useToggledLines(tile, lines)

    return (
        <div className={classes.selectLines}>
            <Heading4>Velg transportmidler og linjer</Heading4>
            <div className={classes.linesContainer}>
                {linesByMode.map(({ transportMode, lines }) => (
                    <div key={transportMode}>
                        <div className={classes.transportTitle}>
                            <TransportIcon transport={transportMode} />
                            {transportModeNames[transportMode]}
                        </div>
                        <div className="flexRow alignCenter">
                            <Checkbox
                                checked={isAllLinesForModeToggled(
                                    transportMode,
                                )}
                                onChange={() =>
                                    toggleAllLinesForMode(transportMode)
                                }
                            />
                            Velg alle
                        </div>
                        {lines.map((line) => (
                            <div
                                key={line.id}
                                className="flexRow alignCenter pl-3 g-1"
                            >
                                <Checkbox
                                    checked={isLineToggled(line)}
                                    onChange={() => toggleLine(line)}
                                />
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
