import {
    DEFAULT_COLUMNS,
    DEFAULT_COMBINED_COLUMNS,
} from 'app/(admin)/components/TileSelector/utils'
import { BaseTile } from 'Board/components/BaseTile'
import {
    combineSituations,
    defaultFontSize,
    getAccumulatedTileSituations,
    getFontScale,
} from 'Board/scenarios/Board/utils'
import { CombinedTileDeviation } from 'Board/scenarios/Table/components/StopPlaceDeviation'
import { useCycler } from 'Board/scenarios/Table/useCycler'
import { Tile } from 'components/Tile'
import { TDepartureFragment, TSituationFragment } from 'graphql/index'
import { BoardDB, BoardTileDB } from 'types/db-types/boards'
import { isNotNullOrUndefined } from 'utils/typeguards'
import { Table_Legacy } from './Table_Legacy'

// Helper types
type CustomName = {
    uuid: string
    customName: string
}

function LegacyTile({
    tileSpec,
    data,
    className,
    theme,
    palette,
}: {
    tileSpec: BoardTileDB
    data: any
    className?: string
    theme?: string | null
    palette?: string | null
}) {
    // Process data similar to useStopPlaceTileData / useQuayTileData
    const estimatedCalls: TDepartureFragment[] = (
        data?.stopPlace?.estimatedCalls ??
        data?.quay?.estimatedCalls ??
        []
    ).map((call: any) => ({
        ...call,
        tileUuid: tileSpec.uuid,
    }))

    const situations: TSituationFragment[] =
        data?.stopPlace?.situations ?? data?.quay?.situations ?? []

    // For QuayTile, we might need stopPlace situations too?
    // useQuayTileData:
    // const situations = [
    //    ...(data?.quay?.situations ?? []),
    //    ...(data?.quay?.stopPlace?.situations ?? []),
    // ]
    if (tileSpec.type === 'quay' && data?.quay?.stopPlace?.situations) {
        situations.push(...data.quay.stopPlace.situations)
    }

    const uniqueSituations = getAccumulatedTileSituations(
        estimatedCalls,
        situations,
    )

    const currentSituationIndex = useCycler(uniqueSituations ?? [], 10000)

    return (
        <BaseTile
            displayName={tileSpec.displayName}
            estimatedCalls={estimatedCalls}
            situations={situations}
            uniqueSituations={uniqueSituations ?? []}
            currentSituationIndex={currentSituationIndex}
            isLoading={false}
            hasData={!!data}
            columns={tileSpec.columns ?? DEFAULT_COLUMNS}
            walkingDistance={tileSpec.walkingDistance}
            className={className}
            theme={theme}
            TableComponent={Table_Legacy}
        />
    )
}

function LegacyCombinedTile({
    combinedTile,
    tilesData,
    className,
    theme,
}: {
    combinedTile: BoardTileDB[]
    tilesData: Record<string, any>
    className?: string
    theme?: string | null
}) {
    // Process data similar to useCombinedTileData

    const estimatedCalls: any[] = []
    const situations: TSituationFragment[] = []

    combinedTile.forEach((tile) => {
        const data = tilesData[tile.uuid]
        if (!data) return

        const calls = (
            data.stopPlace?.estimatedCalls ??
            data.quay?.estimatedCalls ??
            []
        ).map((call: any) => ({
            ...call,
            tileUuid: tile.uuid,
        }))
        estimatedCalls.push(...calls)

        const origin = data.stopPlace?.name ?? data.quay?.name ?? ''
        const tileSituations =
            data.stopPlace?.situations ?? data.quay?.situations ?? []
        situations.push(...tileSituations.map((s: any) => ({ ...s, origin })))

        if (tile.type === 'quay' && data.quay?.stopPlace?.situations) {
            situations.push(
                ...data.quay.stopPlace.situations.map((s: any) => ({
                    ...s,
                    origin,
                })),
            )
        }
    })

    const sortedEstimatedCalls = estimatedCalls.sort((a, b) => {
        const timeA = new Date(a.expectedDepartureTime).getTime()
        const timeB = new Date(b.expectedDepartureTime).getTime()
        return (
            (isNaN(timeA) ? Infinity : timeA) -
            (isNaN(timeB) ? Infinity : timeB)
        )
    })

    const combinedSituations = combineSituations(situations)
    const uniqueSituations = getAccumulatedTileSituations(
        sortedEstimatedCalls,
        combinedSituations,
    )
    const currentSituationIndex = useCycler(uniqueSituations ?? [], 10000)

    const customNames: CustomName[] = combinedTile
        .map((tile) =>
            tile.displayName
                ? { uuid: tile.uuid, customName: tile.displayName }
                : null,
        )
        .filter(isNotNullOrUndefined)

    return (
        <BaseTile
            estimatedCalls={sortedEstimatedCalls}
            situations={combinedSituations}
            uniqueSituations={uniqueSituations ?? []}
            currentSituationIndex={currentSituationIndex}
            customNames={customNames}
            isLoading={false}
            hasData={estimatedCalls.length > 0}
            columns={DEFAULT_COMBINED_COLUMNS}
            customDeviation={
                <CombinedTileDeviation situations={combinedSituations} />
            }
            className={className}
            theme={theme}
            TableComponent={Table_Legacy}
        />
    )
}

function Board_Legacy({
    board,
    tilesData,
}: {
    board: BoardDB
    tilesData: Record<string, any>
}) {
    if (!board.tiles || !board.tiles.length)
        return (
            <Tile className="flex h-full items-center justify-center">
                <p>Du har ikke lagt til noen stoppesteder ennå.</p>
            </Tile>
        )

    const combinedTiles = getCombinedTiles(board)
    const separateTiles = getSeparateTiles(board)
    const totalTiles = separateTiles.length + combinedTiles.length
    const fontScaleClass = getFontScale(
        board.meta?.fontSize || defaultFontSize(board),
    )

    const baseGridClass = 'grid h-full gap-2.5 overflow-hidden'
    const fallbackFlexClass =
        'supports-[not(display:grid)]:flex supports-[not(display:grid)]:*:m-2.5'
    const responsiveGridClass =
        'max-sm:overflow-y-scroll xs:grid-cols-1 sm:grid-cols-[repeat(auto-fit,_minmax(33%,_1fr))]'

    const gridId = `legacy-grid-${board.id}`
    const gridClassName = `${baseGridClass} ${fallbackFlexClass} ${responsiveGridClass} ${fontScaleClass} ${gridId}`

    const hasOddTileCount = totalTiles % 2 === 1

    const getRowSpanClass = (tileIndex: number) => {
        if (!hasOddTileCount || tileIndex !== 0) return undefined
        return 'sm:max-3xl:row-span-2'
    }

    return (
        <>
            <style>
                {`
                @media (min-width: 1920px) {
                    .${gridId} {
                        grid-template-columns: repeat(${totalTiles}, minmax(0, 1fr));
                    }
                }
            `}
            </style>
            <div
                data-transport-palette={board.transportPalette}
                data-theme={board.theme}
                className={gridClassName}
            >
                {separateTiles.map((tile, index) => {
                    return (
                        <LegacyTile
                            key={index}
                            tileSpec={tile}
                            data={tilesData[tile.uuid]}
                            className={getRowSpanClass(index)}
                            theme={board.theme}
                        />
                    )
                })}
                {combinedTiles.map((combinedTile, index) => (
                    <LegacyCombinedTile
                        key={index}
                        combinedTile={combinedTile}
                        tilesData={tilesData}
                        theme={board.theme}
                    />
                ))}
            </div>
        </>
    )
}

export { Board_Legacy }

function getCombinedTiles(board: BoardDB) {
    const combinedTileIds = board.combinedTiles?.map((c) => c.ids) ?? []
    return (
        combinedTileIds?.map((ids) =>
            board.tiles.filter((t) => ids.includes(t.uuid)),
        ) || []
    )
}

function getSeparateTiles(board: BoardDB) {
    const combinedTileIds = board.combinedTiles?.map((c) => c.ids) ?? []
    return board.tiles.filter((t) => !combinedTileIds?.flat().includes(t.uuid))
}
