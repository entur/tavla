import { TransportIcon } from '../TransportIcon'
import classes from './styles.module.css'
import { TTransportMode } from 'types/graphql-schema'

function TableHeader({
    heading,
    transportModes,
}: {
    heading: string
    transportModes: (TTransportMode | null)[] | null
}) {
    return (
        <div className={classes.headerWrapper}>
            <h3 className={classes.heading}>{heading}</h3>
            {transportModes && (
                <div className={classes.transportWrapper}>
                    {transportModes.map((transport) => (
                        <TransportIcon key={transport} transport={transport} />
                    ))}
                </div>
            )}
        </div>
    )
}

export { TableHeader }
