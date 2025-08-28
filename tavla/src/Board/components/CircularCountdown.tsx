import { useEffect, useState } from 'react'

export const CircularCountdown = ({
    duration = 10000,
    size = '1.5em',
    strokeWidth = 3,
    color = 'var(--warning-color)',
}) => {
    const radius = 16 - strokeWidth / 2
    const circumference = 2 * Math.PI * radius

    const [strokeDashoffset, setStrokeDashoffset] = useState(0)

    useEffect(() => {
        const startTime = Date.now()
        const interval = setInterval(() => {
            const elapsedTime = Date.now() - startTime
            const progress = Math.min(elapsedTime / duration, 1)
            setStrokeDashoffset(circumference * progress)

            if (progress === 1) clearInterval(interval)
        }, 16)

        return () => clearInterval(interval)
    }, [duration, circumference])

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 32 32"
            style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 4,
            }}
        >
            <circle
                cx="16"
                cy="16"
                r={radius}
                fill="none"
                stroke={color}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                style={{
                    transform: 'rotate(-90deg)',
                    transformOrigin: '50% 50%',
                    transition: 'stroke-dashoffset 0.016s linear',
                }}
            />
        </svg>
    )
}
