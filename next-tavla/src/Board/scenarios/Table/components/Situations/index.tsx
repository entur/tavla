import { Situation } from '../Situation'
import { useNonNullContext } from 'hooks/useNonNullContext'
import { DepartureContext } from '../../contexts'
import classes from './styles.module.css'
import { useEffect, useRef, useState } from 'react'

function widthToAnimationSeconds(width: number, containerWidth: number) {
    // Scrollspeed 1 / 40 based on språkrådet's advice of max 9 symbols per second
    return (width + containerWidth) / 40 + 's'
}

function Situations() {
    const departure = useNonNullContext(DepartureContext)

    const animationWrapperRef = useRef<HTMLDivElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const [animationSeconds, setAnimationSeconds] = useState<
        string | undefined
    >()

    useEffect(() => {
        if (!animationWrapperRef.current || !containerRef.current) return
        if (
            animationWrapperRef.current.clientWidth >
            containerRef.current.clientWidth
        )
            setAnimationSeconds(
                widthToAnimationSeconds(
                    animationWrapperRef.current.clientWidth,
                    containerRef.current.clientWidth,
                ),
            )
        else setAnimationSeconds('0s')
    }, [])

    return (
        <td>
            <div ref={containerRef}>
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
                </div>
            </div>
        </td>
    )
}
export { Situations }
