import {
    DataFetchingFailed,
    FetchErrorTypes,
} from 'Board/components/DataFetchingFailed'
import { TileLoader } from 'Board/components/TileLoader'
import { CustomName } from 'Board/hooks/useTileData'
import { TileSituations } from 'Board/scenarios/Table/components/TileSituations'
import { Tile } from 'components/Tile'
import { TDepartureFragment, TSituationFragment } from 'graphql/index'
import { ReactNode } from 'react'
import { BoardWalkingDistanceDB, TileColumnDB } from 'types/db-types/boards'
import { TileSituation } from '../../scenarios/Board/utils'
import { Table } from '../../scenarios/Table'
import { StopPlaceQuayDeviation } from '../../scenarios/Table/components/StopPlaceDeviation'
import { TableHeader } from '../../scenarios/Table/components/TableHeader'

interface BaseTileProps {
    displayName?: string
    estimatedCalls: TDepartureFragment[]
    situations: TSituationFragment[]
    uniqueSituations: TileSituation[]
    currentSituationIndex: number
    customNames?: CustomName[]
    isLoading: boolean
    error?: Error
    hasData: boolean
    columns: TileColumnDB[]
    walkingDistance?: BoardWalkingDistanceDB
    className?: string
    customHeader?: ReactNode
    customDeviation?: ReactNode
}

export function BaseTile({
    displayName,
    estimatedCalls,
    situations,
    uniqueSituations,
    currentSituationIndex,
    customNames,
    isLoading,
    error,
    hasData,
    columns,
    walkingDistance,
    customHeader,
    customDeviation,
    className,
}: BaseTileProps) {
    if (isLoading && !hasData) {
        return (
            <Tile className={className}>
                <TileLoader />
            </Tile>
        )
    }

    if (error || !hasData) {
        return (
            <Tile className={className}>
                <DataFetchingFailed
                    timeout={error?.message === FetchErrorTypes.TIMEOUT}
                />
            </Tile>
        )
    }

    if (!estimatedCalls || estimatedCalls.length === 0) {
        return (
            <Tile className={`flex flex-col ${className || ''}`}>
                <div className="flex-grow overflow-hidden">
                    {customHeader ??
                        (displayName && (
                            <TableHeader
                                heading={displayName}
                                walkingDistance={walkingDistance}
                            />
                        ))}
                </div>
                <div className="flex h-full w-full items-center justify-center text-center text-tertiary">
                    Ingen avganger i nærmeste fremtid
                </div>
            </Tile>
        )
    }

    return (
        <Tile className={`flex flex-col ${className || ''}`}>
            <div className="flex-grow overflow-hidden">
                {customHeader ??
                    (displayName && (
                        <TableHeader
                            heading={displayName}
                            walkingDistance={walkingDistance}
                        />
                    ))}

                {customDeviation ?? (
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
                    customNames={customNames}
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
