type DeviationIconProps = {
    deviationType: 'cancellation' | 'situation' | 'no-deviation'
    isHighlighted?: boolean
}

export const DeviationIcon_Legacy = ({
    isHighlighted = true,
    deviationType,
}: DeviationIconProps) => {
    const size = '1.3em'

    if (deviationType === 'no-deviation') {
        return null
    }

    const color =
        deviationType === 'cancellation'
            ? '#C5044E' // Entur Red
            : '#FF9E00' // Entur Orange (Warning)

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
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M9 16C12.866 16 16 12.866 16 9C16 5.13401 12.866 2 9 2C5.13401 2 2 5.13401 2 9C2 12.866 5.13401 16 9 16ZM9 13.5C9.55228 13.5 10 13.0523 10 12.5C10 11.9477 9.55228 11.5 9 11.5C8.44772 11.5 8 11.9477 8 12.5C8 13.0523 8.44772 13.5 9 13.5ZM9 10.5C9.55228 10.5 10 10.0523 10 9.5V5.5C10 4.94772 9.55228 4.5 9 4.5C8.44772 4.5 8 4.94772 8 5.5V9.5C8 10.0523 8.44772 10.5 9 10.5Z"
                                fill={color}
                            />
                            <path
                                d="M18 9C18 13.9706 13.9706 18 9 18C4.02944 18 0 13.9706 0 9C0 4.02944 4.02944 0 9 0C13.9706 0 18 4.02944 18 9ZM1.44 9C1.44 13.1753 4.82473 16.56 9 16.56C13.1753 16.56 16.56 13.1753 16.56 9C16.56 4.82473 13.1753 1.44 9 1.44C4.82473 1.44 1.44 4.82473 1.44 9Z"
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
                            fillOpacity="0.3"
                        />
                        <path
                            d="M18 9C18 13.9706 13.9706 18 9 18C4.02944 18 0 13.9706 0 9C0 4.02944 4.02944 0 9 0C13.9706 0 18 4.02944 18 9ZM1.44 9C1.44 13.1753 4.82473 16.56 9 16.56C13.1753 16.56 16.56 13.1753 16.56 9C16.56 4.82473 13.1753 1.44 9 1.44C4.82473 1.44 1.44 4.82473 1.44 9Z"
                            fill={color}
                            fillOpacity="0.3"
                        />
                    </svg>
                ) : (
                    <svg
                        width={size}
                        height={size}
                        viewBox="0 0 18 18"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M9 16C12.866 16 16 12.866 16 9C16 5.13401 12.866 2 9 2C5.13401 2 2 5.13401 2 9C2 12.866 5.13401 16 9 16ZM9 13.5C9.55228 13.5 10 13.0523 10 12.5C10 11.9477 9.55228 11.5 9 11.5C8.44772 11.5 8 11.9477 8 12.5C8 13.0523 8.44772 13.5 9 13.5ZM9 10.5C9.55228 10.5 10 10.0523 10 9.5V5.5C10 4.94772 9.55228 4.5 9 4.5C8.44772 4.5 8 4.94772 8 5.5V9.5C8 10.0523 8.44772 10.5 9 10.5Z"
                            fill={color}
                            fillOpacity="0.3"
                        />
                        <path
                            d="M18 9C18 13.9706 13.9706 18 9 18C4.02944 18 0 13.9706 0 9C0 4.02944 4.02944 0 9 0C13.9706 0 18 4.02944 18 9ZM1.44 9C1.44 13.1753 4.82473 16.56 9 16.56C13.1753 16.56 16.56 13.1753 16.56 9C16.56 4.82473 13.1753 1.44 9 1.44C4.82473 1.44 1.44 4.82473 1.44 9Z"
                            fill={color}
                            fillOpacity="0.3"
                        />
                    </svg>
                )}
            </div>
        </div>
    )
}
