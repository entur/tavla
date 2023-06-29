import { Situation } from '../Situation'
import { useNonNullContext } from 'hooks/useNonNullContext'
import { DepartureContext } from '../../contexts'
import classes from './styles.module.css'
import { useEffect, useRef, useState } from 'react'

function widthToAnimationSeconds(width: number) {
    console.log(width / 15)
    return width / 16 + 's'
}

function Situations() {
    const departure = useNonNullContext(DepartureContext)

    const animationWrapperRef = useRef<HTMLDivElement>(null)
    const [animationSeconds, setAnimationSeconds] = useState<
        string | undefined
    >()

    useEffect(() => {
        if (!animationWrapperRef.current) return
        setAnimationSeconds(
            widthToAnimationSeconds(animationWrapperRef.current.clientWidth),
        )
    }, [animationWrapperRef.current])

    return (
        <td>
            <div>
                <div
                    className={classes.situationsWrapper}
                    ref={animationWrapperRef}
                    style={{
                        animationDuration: animationSeconds,
                    }}
                >
                    {departure.situations.map((situation) => (
                        <Situation key={situation.id} situation={situation} />
                    ))}
                    {/* {departure.situations.map((situation) => (
                        <Situation key={situation.id} situation={situation} />
                    ))} */}
                </div>
            </div>
        </td>
    )
}
export { Situations }
