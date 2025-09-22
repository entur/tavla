import {
    DataFetchingFailed,
    FetchErrorTypes,
} from 'Board/components/DataFetchingFailed'
import { TileLoader } from 'Board/components/TileLoader'
import { TileSituations } from 'Board/scenarios/Table/components/TileSituations'
import { Tile } from 'components/Tile'
import { TDepartureFragment, TSituationFragment } from 'graphql/index'
import { ReactNode } from 'react'
import { TColumn } from 'types/column'
import { TWalkingDistance } from 'types/tile'
import { TileSituation } from '../../scenarios/Board/utils'
import { Table } from '../../scenarios/Table'
import { StopPlaceQuayDeviation } from '../../scenarios/Table/components/StopPlaceDeviation'
import { TableHeader } from '../../scenarios/Table/components/TableHeader'

interface BaseTileProps {
    displayName: string
    estimatedCalls: TDepartureFragment[]
    situations: TSituationFragment[]
    uniqueSituations: TileSituation[]
    currentSituationIndex: number

    isLoading: boolean
    error?: Error
    hasData: boolean

    columns: TColumn[]
    walkingDistance?: TWalkingDistance

    className?: string
    renderCustomHeader?: () => ReactNode
    renderCustomDeviation?: () => ReactNode
}

export function BaseTile({
    displayName,
    estimatedCalls,
    situations,
    uniqueSituations,
    currentSituationIndex,
    isLoading,
    error,
    hasData,
    columns,
    walkingDistance,
    className = 'flex flex-col max-sm:min-h-[30vh]',
    renderCustomHeader,
    renderCustomDeviation,
}: BaseTileProps) {
    if (isLoading && !hasData) {
        return (
            <Tile>
                <TileLoader />
            </Tile>
        )
    }

    if (error || !hasData) {
        return (
            <Tile>
                <DataFetchingFailed
                    timeout={error?.message === FetchErrorTypes.TIMEOUT}
                />
            </Tile>
        )
    }

    if (!estimatedCalls || estimatedCalls.length === 0) {
        return (
            <Tile className={className}>
                <div className="flex-grow overflow-hidden">
                    {renderCustomHeader ? (
                        renderCustomHeader()
                    ) : (
                        <TableHeader
                            heading={displayName}
                            walkingDistance={walkingDistance}
                        />
                    )}
                </div>
                <div className="flex h-full w-full items-center justify-center text-center text-tertiary">
                    Ingen avganger i nærmeste fremtid
                </div>
            </Tile>
        )
    }

    return (
        <Tile className={className}>
            <div className="flex-grow overflow-hidden">
                {renderCustomHeader ? (
                    renderCustomHeader()
                ) : (
                    <TableHeader
                        heading={displayName}
                        walkingDistance={walkingDistance}
                    />
                )}

                {renderCustomDeviation ? (
                    renderCustomDeviation()
                ) : (
                    <StopPlaceQuayDeviation situations={situations} />
                )}

                <Table
                    columns={columns}
                    departures={estimatedCalls}
                    stopPlaceSituations={situations}
                    currentVisibleSituationId={
                        uniqueSituations?.[currentSituationIndex]?.situation.id
                    }
                    numberOfVisibleSituations={uniqueSituations?.length}
                />
            </div>

            {uniqueSituations && uniqueSituations.length > 0 && (
                <TileSituations
                    situation={
                        uniqueSituations[currentSituationIndex]?.situation
                    }
                    currentSituationNumber={currentSituationIndex}
                    numberOfSituations={uniqueSituations.length}
                    cancelledDeparture={
                        uniqueSituations[currentSituationIndex]?.cancellation ??
                        false
                    }
                    transportModeList={
                        uniqueSituations[currentSituationIndex]
                            ?.transportModeList
                    }
                    publicCodeList={
                        uniqueSituations[currentSituationIndex]?.publicCodeList
                    }
                />
            )}
        </Tile>
    )
}
