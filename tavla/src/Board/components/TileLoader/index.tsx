import { Loader } from '@entur/loader'

function TileLoader() {
    return (
        <div className="w-full h-full flex flex-col justify-center ">
            <div className="w-full text-center">
                Henter avganger...
                <Loader />
            </div>
        </div>
    )
}

export { TileLoader }
