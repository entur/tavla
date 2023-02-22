import React, { Dispatch, useCallback, useEffect, useState } from 'react'
import type { User } from 'firebase/auth'
import { useUser } from 'settings/UserProvider'
import { LoginModal } from 'components/AccountModals/LoginModal/LoginModal'
import { LoginCase } from 'components/AccountModals/LoginModal/login-modal-types'
import { GridContainer, GridItem } from '@entur/grid'
import {
    Heading2,
    Label,
    Link,
    ListItem,
    Paragraph,
    UnorderedList,
} from '@entur/typography'
import { LogoUpload } from './LogoUpload/LogoUpload'
import { SizePicker } from './SizePicker/SizePicker'
import { Description } from './Description/Description'
import classes from './LogoTab.module.scss'

interface Props {
    tabIndex: number
    setTabIndex: Dispatch<number>
}

const LogoTab = ({ tabIndex, setTabIndex }: Props): JSX.Element => {
    const [open, setOpen] = useState<boolean>(false)
    const user = useUser()

    useEffect((): void => {
        if (tabIndex === 3 && user && user.isAnonymous) {
            setOpen(true)
        }

        if (user && !user.isAnonymous) {
            setOpen(false)
        }
    }, [user, tabIndex, setTabIndex])

    const handleDismiss = useCallback(
        (newUser: User | undefined): void => {
            if (!newUser || newUser.isAnonymous) {
                setOpen(false)
                setTabIndex(0)
            }
        },
        [setOpen, setTabIndex],
    )

    return (
        <div>
            <LoginModal
                onDismiss={handleDismiss}
                open={open}
                loginCase={LoginCase.logo}
            />
            <Heading2 className="heading">Last opp logo</Heading2>
            <GridContainer spacing="extraLarge" className={classes.LogoGrid}>
                <GridItem small={12} medium={12} large={6}>
                    <Paragraph className={classes.Paragraph}>
                        Her kan du legge inn egen logo på din tavle. Logoen vil
                        være plassert i øverste venstre hjørne, og ha en høyde
                        på 32 piksler som standard. Du kan velge å sette
                        størrelsen til stor logo (56px), men da vil du ikke
                        kunne legge til en beskrivelse av avgangstavla.
                    </Paragraph>
                    <Label className={classes.Label}>
                        Krav til logo for best resultat
                    </Label>
                    <UnorderedList>
                        <ListItem>
                            Logo bør lastes opp med transparent bakgrunn i .png
                            eller .svg-format.
                        </ListItem>
                        <ListItem>
                            Ha god nok kontrast til bakgrunnen i valgt
                            fargetema. Vi anbefaler å bruke en lys eller hvit
                            logo på de mørke temaene, og farget/sort logo på lys
                            bakgrunn for å sikre krav til universell utforming.
                            Om du er i tvil kan du sjekke kontrasten i{' '}
                            <Link
                                target="_blank"
                                rel="noopener noreferrer"
                                href="https://webaim.org/resources/contrastchecker"
                            >
                                WebAIM sitt verktøy for kontrastsjekking
                            </Link>
                            .
                        </ListItem>
                        <ListItem>
                            For å unngå en pikslete logo, bør den lastes opp i
                            dobbel størrelse som høyden i valgt logostørrelse.
                            Minste høyde på filen bør derfor være 64 piksler.
                            Ved stor logo bør filen være minst 112px høy.
                        </ListItem>
                    </UnorderedList>
                    <LogoUpload />
                    <SizePicker />
                </GridItem>
                <GridItem small={12} medium={12} large={6}>
                    <Description />
                </GridItem>
            </GridContainer>
        </div>
    )
}

export { LogoTab }
