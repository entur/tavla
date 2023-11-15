import { Loader } from '@entur/loader'

function TileLoader() {
    return (
        <div className="w-100 h-100 flexColumn justifyCenter">
            <div className="w-100 textCenter">
                Laster tavle...
                <Loader />
            </div>
        </div>
    )
}

export { TileLoader }
