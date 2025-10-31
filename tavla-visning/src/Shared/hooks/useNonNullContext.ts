import React from 'react'

function useNonNullContext<T>(context: React.Context<T | undefined>) {
    const value = React.useContext(context)
    if (!value)
        throw new Error(
            'Context value was null or undefined, and may have been used outside its provider.',
        )

    return value
}

export { useNonNullContext }
