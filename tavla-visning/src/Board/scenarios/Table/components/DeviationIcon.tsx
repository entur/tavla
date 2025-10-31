import {
    ValidationErrorFilledIcon,
    ValidationExclamationCircleFilledIcon,
} from '@entur/icons'

type DeviationIconProps = {
    deviationType: 'cancellation' | 'situation' | 'no-deviation'
    isHighlighted?: boolean
}

export const DeviationIcon = ({
    isHighlighted = true,
    deviationType,
}: DeviationIconProps) => {
    const size = '1.3em'

    if (deviationType === 'no-deviation') {
        return null
    }

    const color =
        deviationType === 'cancellation'
            ? 'var(--error-color)'
            : 'var(--warning-color)'

    if (isHighlighted) {
        return (
            <div
                className="relative inline-flex items-center justify-center"
                style={{ width: size, height: size }}
            >
                <div className="flex items-center justify-center">
                    {deviationType === 'cancellation' ? (
                        <svg
                            width={size}
                            height={size}
                            viewBox="0 0 18 18"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M9 16C12.866 16 16 12.866 16 9C16 5.13401 12.866 2 9 2C5.13401 2 2 5.13401 2 9C2 12.866 5.13401 16 9 16ZM6.07574 11.0758L8.15148 9.00007L6.07574 6.92433L6.92427 6.07581L9.00001 8.15154L11.0757 6.07581L11.9243 6.92433L9.84854 9.00007L11.9243 11.0758L11.0757 11.9243L9.00001 9.8486L6.92427 11.9243L6.07574 11.0758Z"
                                fill={color}
                            />
                            <path
                                d="M18 9C18 13.9706 13.9706 18 9 18C4.02944 18 0 13.9706 0 9C0 4.02944 4.02944 0 9 0C13.9706 0 18 4.02944 18 9ZM1.44 9C1.44 13.1753 4.82473 16.56 9 16.56C13.1753 16.56 16.56 13.1753 16.56 9C16.56 4.82473 13.1753 1.44 9 1.44C4.82473 1.44 1.44 4.82473 1.44 9Z"
                                fill={color}
                            />
                        </svg>
                    ) : (
                        <svg
                            width={size}
                            height={size}
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M18 9C18 13.9706 13.9706 18 9 18C4.02944 18 0 13.9706 0 9C0 4.02944 4.02944 0 9 0C13.9706 0 18 4.02944 18 9ZM1.44 9C1.44 13.1753 4.82473 16.56 9 16.56C13.1753 16.56 16.56 13.1753 16.56 9C16.56 4.82473 13.1753 1.44 9 1.44C4.82473 1.44 1.44 4.82473 1.44 9Z"
                                fill={color}
                            />
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M9 2C5.1 2 2 5.1 2 9C2 12.9 5.1 16 9 16C12.9 16 16 12.9 16 9C16 5.1 12.9 2 9 2ZM8.3 5H9.7V10.1H8.3V5ZM9 13.2C8.5 13.2 8.1 12.8 8.1 12.3C8.1 11.8 8.5 11.4 9 11.4C9.5 11.4 9.9 11.8 9.9 12.3C9.9 12.9 9.5 13.2 9 13.2Z"
                                fill={color}
                            />
                        </svg>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div
            className="flex items-center justify-center"
            style={{ width: size, height: size }}
        >
            {deviationType === 'cancellation' ? (
                <ValidationErrorFilledIcon
                    opacity={0.5}
                    color="var(--error-color)"
                    size="1.17em"
                />
            ) : (
                <ValidationExclamationCircleFilledIcon
                    opacity={0.5}
                    color="var(--warning-color)"
                    size="1.17em"
                />
            )}
        </div>
    )
}
