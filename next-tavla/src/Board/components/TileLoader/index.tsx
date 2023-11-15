import classes from './styles.module.css'

function TileLoader() {
    return (
        <div className="w-100 h-100 flexColumn justifyCenter">
            <div className="w-100 textCenter">
                Laster tavle...
                <div className={classes.loader}>
                    <div className={classes.loaderBar}></div>
                </div>
            </div>
        </div>
    )
}

export { TileLoader }
