'use client'
import { useSearchParamsSetter } from 'app/(root)/(admin)/hooks/useSearchParamsSetter'
import { Heading3, Paragraph } from '@entur/typography'
import { PrimaryButton, SecondaryButton } from '@entur/button'
import Image from 'next/image'
import musk from 'assets/illustrations/Musk.png'
import Link from 'next/link'
import { TLoginPage } from './types'

function Start() {
    const getPathWithParams = useSearchParamsSetter<TLoginPage>('login')
    return (
        <div className="flex flex-col text-center items-center">
            <Image
                src={musk}
                aria-hidden="true"
                alt=""
                className="h-1/2 w-1/2"
            />
            <Heading3 margin="bottom" as="h1">
                Logg inn for å fortsette
            </Heading3>
            <Paragraph>
                Logg inn for å få tilgang til å opprette og administrere tavler.
            </Paragraph>
            <div className="flex flex-col gap-4 w-full">
                <PrimaryButton as={Link} href={getPathWithParams('email')}>
                    Logg inn med e-post
                </PrimaryButton>
                <SecondaryButton as={Link} href={getPathWithParams('create')}>
                    Opprett ny bruker
                </SecondaryButton>
            </div>
        </div>
    )
}

export { Start }
