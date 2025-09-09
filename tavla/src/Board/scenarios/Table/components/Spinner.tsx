import { useEffect, useState } from 'react'

export const CircularCountdown = ({ color = 'var(--warning-color)' }) => {
    const duration = 10000
    const INTERVAL_MS = 16
    const size = '1.5em'
    const CENTER_COORDINATE = 8
    const strokeWidth = 1.5
    const radius = CENTER_COORDINATE - strokeWidth / 2
    const circumference = 2 * Math.PI * radius
    const [strokeDashoffset, setStrokeDashoffset] = useState(0)

    useEffect(() => {
        const startTime = Date.now()
        const interval = setInterval(() => {
            const elapsedTime = Date.now() - startTime
            const progress = Math.min(elapsedTime / duration, 1)
            setStrokeDashoffset(circumference * progress)
            if (progress === 1) clearInterval(interval)
        }, INTERVAL_MS)
        return () => clearInterval(interval)
    }, [duration, circumference])

    return (
        <svg
            width={size}
            height={size}
            viewBox="-1 -1 18 18"
            className="absolute left-1/2 top-1/2 z-[4] -translate-x-1/2 -translate-y-1/2 transform"
        >
            <circle
                cx="10.1"
                cy="8.1"
                r={radius}
                fill="none"
                stroke={color}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="origin-center -rotate-90"
                style={{
                    transition: 'stroke-dashoffset 0.016s linear',
                }}
            />
        </svg>
    )
}
