'use client'
import { ReactNode } from 'react'
import { Contrast as EnturContrast } from '@entur/layout'

function Contrast({ children }: { children: ReactNode }) {
    return <EnturContrast>{children}</EnturContrast>
}

export { Contrast }
