'use client'

import type { JSX } from 'react'

interface ShowcaseContentProps {
    children: JSX.Element | undefined
}

export function ShowcaseContent({ children }: ShowcaseContentProps) {
    return (
        <div className="relative flex w-full h-full justify-center items-center">
            {children}
        </div>
    )
}
