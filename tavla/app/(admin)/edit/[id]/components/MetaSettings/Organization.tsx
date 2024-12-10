'use client'
import { Dropdown } from '@entur/dropdown'
import { Checkbox } from '@entur/form'
import { Heading3 } from '@entur/typography'
import { FormError } from 'app/(admin)/components/FormError'
import { useOrganizations } from 'app/(admin)/hooks/useOrganizations'
import { getFormFeedbackForField } from 'app/(admin)/utils'
import ClientOnly from 'app/components/NoSSR/ClientOnly'
import { SubmitButton } from 'components/Form/SubmitButton'
import { useState, useActionState } from 'react'
import { TBoardID, TOrganization } from 'types/settings'
import { moveBoard as moveBoardAction } from './actions'
import { useToast } from '@entur/alert'

function Organization({
    bid,
    organization,
}: {
    bid: TBoardID
    organization?: TOrganization
}) {
    const { addToast } = useToast()

    const { organizations, selectedOrganization, setSelectedOrganization } =
        useOrganizations(organization)
    const [personal, setPersonal] = useState(organization ? false : true)

    const moveBoard = async () => {
        const formFeedback = await moveBoardAction(
            bid,
            personal,
            selectedOrganization?.value.id,
            organization?.id,
        )
        if (!formFeedback) {
            addToast('Tavlen ble flyttet til organisasjon!')
        }
        return formFeedback
    }

    const [moveBoardState, moveBordFormAction] = useActionState(
        moveBoard,
        undefined,
    )
    return (
        <form action={moveBordFormAction} className="box flex flex-col">
            <Heading3 margin="bottom">Organisasjon</Heading3>
            <ClientOnly>
                <Dropdown
                    items={organizations}
                    label="Dine organisasjoner"
                    selectedItem={selectedOrganization}
                    onChange={setSelectedOrganization}
                    clearable
                    className="mb-4"
                    aria-required="true"
                    disabled={personal}
                />
            </ClientOnly>
            <Checkbox
                defaultChecked={personal}
                onChange={() => setPersonal(!personal)}
                name="personal"
            >
                Privat tavle
            </Checkbox>
            <div className="mt-4">
                <FormError
                    {...getFormFeedbackForField('organization', moveBoardState)}
                />
                <FormError
                    {...getFormFeedbackForField('general', moveBoardState)}
                />
            </div>
            <div className="flex flex-row mt-8 justify-end">
                <SubmitButton variant="secondary" className="max-sm:w-full">
                    Lagre organisasjon
                </SubmitButton>
            </div>
        </form>
    )
}

export { Organization }
