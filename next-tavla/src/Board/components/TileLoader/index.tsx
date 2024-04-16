import classes from './styles.module.css'

function TileLoader() {
    return (
        <div className="w-full h-full flex flex-col justify-center ">
            <div className="w-full text-center">
                Henter avganger...
                <div className={classes.loader}>
                    <div className={classes.loaderBar}></div>
                </div>
            </div>
        </div>
    )
}

export { TileLoader }
