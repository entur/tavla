'use client'
import { PrimaryButton } from '@entur/button'
import { AddIcon } from '@entur/icons'
import { Modal } from '@entur/modal'
import { Paragraph } from '@entur/typography'
import { TextField } from '@entur/form'
import { useFormState } from 'react-dom'
import { createOrganizationAction } from 'Admin/utils/formActions'
import { ToastProvider } from '@entur/alert'
import { usePageParam } from 'app/(admin)/hooks/usePageParam'
import { useRouter, usePathname } from 'next/navigation'
import { getFormFeedbackForField } from 'app/(admin)/utils'
import Link from 'next/link'
import { FormError } from 'app/(admin)/components/Login/FormError'

function CreateOrganization() {
    const [createOpen] = usePageParam('create')
    const router = useRouter()
    const pathname = usePathname()
    const [state, formAction] = useFormState(
        createOrganizationAction,
        undefined,
    )

    return (
        <ToastProvider>
            <PrimaryButton as={Link} href="?create">
                Opprett organisasjon
                <AddIcon />
            </PrimaryButton>
            <Modal
                className="flexColumn alignCenter"
                open={createOpen}
                size="medium"
                onDismiss={() => router.push(pathname ?? '/')}
                title="Opprett organisasjon"
                closeLabel="Avbryt oppretting av organisasjon"
            >
                <Paragraph>
                    Organisasjonen gir deg mulighet til å samarbeide om tavler
                    med andre brukere.
                </Paragraph>
                <form
                    className="flexColumn alignCenter w-100"
                    action={formAction}
                >
                    <TextField
                        size="medium"
                        label="Navn på din organisasjon"
                        className="w-50"
                        id="name"
                        name="name"
                        required
                    />
                    <FormError {...getFormFeedbackForField('general', state)} />
                    <PrimaryButton className="mt-2" type="submit">
                        Opprett
                    </PrimaryButton>
                </form>
            </Modal>
        </ToastProvider>
    )
}

export { CreateOrganization }
