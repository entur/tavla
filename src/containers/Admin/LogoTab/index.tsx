import React, { useState, useEffect, Dispatch } from 'react'

import {
    Heading2,
    Paragraph,
    UnorderedList,
    ListItem,
    Link,
    Label,
} from '@entur/typography'
import { GridItem, GridContainer } from '@entur/grid'

import { useFirebaseAuthentication } from '../../../auth'
import { User } from 'firebase/app'
import { getDocumentId } from '../../../utils'

import LoginModal from '../LoginModal'
import LogoUpload from './LogoUpload'
import SizePicker from './SizePicker'
import Description from './Description'

import './styles.scss'

const Requirements = (): JSX.Element => (
    <>
        <Label className="label">Krav til logo for best resultat</Label>
        <UnorderedList>
            <ListItem>
                Logo bør lastes opp med transparent bakgrunn i .png eller
                .svg-format.
            </ListItem>
            <ListItem>
                Ha god nok kontrast til bakgrunnen i valgt fargetema. Vi
                anbefaler å bruke en lys eller hvit logo på de mørke temaene, og
                farget/sort logo på lys bakgrunn for å sikre krav til universell
                utforming. Om du er i tvil kan du sjekke kontrasten{' '}
                <Link
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://webaim.org/resources/contrastchecker"
                >
                    her
                </Link>
                .
            </ListItem>
            <ListItem>
                For å unngå en pikslete logo, bør den lastes opp i dobbel
                størrelse som høyden i valgt logostørrelse. Minste høyde på
                filen bør derfor være 64 piksler. Ved stor logo bør filen være
                minst 112px høy.
            </ListItem>
        </UnorderedList>
    </>
)

const LogoTab = ({ tabIndex, setTabIndex }: Props): JSX.Element => {
    const [open, setOpen] = useState<boolean>(false)
    const user = useFirebaseAuthentication()

    const documentId = getDocumentId()

    useEffect((): void => {
        if (tabIndex === 3 && user && user.isAnonymous) {
            setOpen(true)
        }

        if (user && !user.isAnonymous) {
            setOpen(false)
        }
    }, [user, tabIndex, setTabIndex])

    const handleDismiss = (newUser: User): void => {
        if (!(newUser && !newUser.isAnonymous)) {
            setOpen(false)
            setTabIndex(0)
        }
    }

    if (!documentId) {
        return (
            <div>
                <Heading2 className="heading">Last opp logo</Heading2>
                <Paragraph>
                    Vi har oppgradert tavla. Ønsker du tilgang på denne
                    funksjonaliteten må du lage en ny tavle.
                </Paragraph>
            </div>
        )
    }

    return (
        <>
            <LoginModal
                onDismiss={handleDismiss}
                open={open}
                loginDescription="For å laste opp logo og beskrivelse på avgangstavla, må du ha en konto."
            />
            <Heading2 className="heading">Last opp logo</Heading2>
            <GridContainer spacing="extraLarge" className="logo-grid">
                <GridItem small={12} medium={12} large={6}>
                    <Paragraph>
                        Her kan du legge inn egen logo på din tavle. Logoen vil
                        være plassert i øverste venstre hjørne, og ha en høyde
                        på 32 piksler som standard. Du kan velge å sette
                        størrelsen til stor logo (56px), men da vil du ikke
                        kunne legge til en beskrivelse av avgangstavla.
                    </Paragraph>
                    <Requirements />
                    <LogoUpload />
                    <SizePicker />
                </GridItem>
                <GridItem small={12} medium={12} large={6}>
                    <Description />
                </GridItem>
            </GridContainer>
        </>
    )
}

interface Props {
    tabIndex: number
    setTabIndex: Dispatch<number>
}

export default LogoTab
