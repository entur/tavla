import { PrimaryButton, SecondaryButton } from '@entur/button'
import { Heading3, Paragraph } from '@entur/typography'
import { TLoginPage } from 'Admin/types/login'
import musk from 'assets/illustrations/Musk.png'
import Image from 'next/image'

function Start({ pushPage }: { pushPage: (page: TLoginPage) => void }) {
    return (
        <div>
            <Image src={musk} alt="illustration" className="h-50 w-50" />
            <Heading3>Logg inn for å fortsette</Heading3>
            <Paragraph>
                Logg inn for å få tilgang til å opprette og administrere tavler.
            </Paragraph>
            <div className="flexColumn">
                <PrimaryButton onClick={() => pushPage('email')}>
                    Logg inn med e-post
                </PrimaryButton>
                <SecondaryButton onClick={() => pushPage('create')}>
                    Opprett ny bruker
                </SecondaryButton>
            </div>
        </div>
    )
}

export { Start }
