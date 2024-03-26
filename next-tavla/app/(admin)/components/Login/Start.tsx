'use client'
import { useSearchParamsSetter } from 'app/(admin)/hooks/useSearchParamsSetter'
import { Heading3, Paragraph } from '@entur/typography'
import { PrimaryButton, SecondaryButton } from '@entur/button'
import Image from 'next/image'
import musk from 'assets/illustrations/Musk.png'
import Link from 'next/link'
import { TLoginPage } from './types'

function Start() {
    const getPathWithParams = useSearchParamsSetter<TLoginPage>('login')
    return (
        <div className="textCenter">
            <Image src={musk} aria-hidden="true" alt="" className="h-50 w-50" />
            <Heading3>Logg inn for å fortsette</Heading3>
            <Paragraph>
                Logg inn for å få tilgang til å opprette og administrere tavler.
            </Paragraph>
            <div className="flexColumn g-2">
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
