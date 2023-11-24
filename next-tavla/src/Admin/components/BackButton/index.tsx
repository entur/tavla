'use client'
import { IconButton } from '@entur/button'
import { useRouter } from 'next/navigation'
import { ReactNode, useEffect } from 'react'

function BackButton({ icon }: { icon: ReactNode }) {
    const router = useRouter()

    useEffect(() => {
        const navigateOnEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') router.back()
        }
        document.addEventListener('keydown', navigateOnEsc)
        return () => document.removeEventListener('keydown', navigateOnEsc)
    }, [router])

    return <IconButton onClick={() => router.back()}>{icon}</IconButton>
}

export { BackButton }
