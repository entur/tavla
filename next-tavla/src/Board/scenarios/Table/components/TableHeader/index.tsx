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
            <h1 className={classes.heading}>{heading}</h1>
            {transportModes && (
                <div>
                    {transportModes.map((mode) => (
                        <TransportIcon key={mode} transport={mode} />
                    ))}
                </div>
            )}
        </div>
    )
}

export { TableHeader }
