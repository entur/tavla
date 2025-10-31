import { Loader } from '@entur/loader'

function TileLoader() {
    return (
        <div className="flex h-full w-full flex-col justify-center">
            <div className="w-full text-center">
                Henter avganger...
                <Loader />
            </div>
        </div>
    )
}

export { TileLoader }
