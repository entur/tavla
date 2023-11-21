'use client'
import { ReactNode } from 'react'
import { ToastProvider as EnturToastProvider } from '@entur/alert'

function ToastProvider({ children }: { children: ReactNode }) {
    return <EnturToastProvider>{children}</EnturToastProvider>
}

export { ToastProvider }
