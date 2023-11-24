'use client'
import { IconButton } from '@entur/button'
import { useRouter } from 'next/navigation'
import { ReactNode } from 'react'

function BackButton({ icon }: { icon: ReactNode }) {
    const router = useRouter()
    return <IconButton onClick={() => router.back()}>{icon}</IconButton>
}

export { BackButton }
