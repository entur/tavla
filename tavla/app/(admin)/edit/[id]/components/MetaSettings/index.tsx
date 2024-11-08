'use client'
import { Checkbox } from '@entur/form'
import { Heading3 } from '@entur/typography'
import { TMeta } from 'types/meta'
import {
    moveBoard as moveBoardAction,
    saveFont as saveFontAction,
    saveTitle as saveTitleAction,
} from './actions'
import { TBoardID, TOrganization } from 'types/settings'
import { FontChoiceChip } from './FontChoiceChip'
import { SubmitButton } from 'components/Form/SubmitButton'
import { Address } from './Adress'
import { DEFAULT_BOARD_NAME } from 'app/(admin)/utils/constants'
import { useToast } from '@entur/alert'
import { Dropdown } from '@entur/dropdown'
import { useOrganizations } from 'app/(admin)/hooks/useOrganizations'
import { useActionState, useState } from 'react'
import {
    TFormFeedback,
    fireToastFeedback,
    getFormFeedbackForField,
} from 'app/(admin)/utils'
import ClientOnlyTextField from 'app/components/NoSSR/TextField'
import { FormError } from 'app/(admin)/components/FormError'
import ClientOnly from 'app/components/NoSSR/ClientOnly'

function MetaSettings({
    bid,
    meta,
    organization,
}: {
    bid: TBoardID
    meta: TMeta
    organization?: TOrganization
}) {
    const { addToast } = useToast()
    const { organizations, selectedOrganization, setSelectedOrganization } =
        useOrganizations(organization)
    const [personal, setPersonal] = useState(organization ? false : true)

    // Handle save title
    const saveTitleWithParams = async (
        state: TFormFeedback | undefined,
        data: FormData,
    ) => {
        const result = await saveTitleAction(state, bid, data)
        fireToastFeedback(addToast, result, 'Tittel oppdatert!')
        return result
    }
    const [titleState, saveTitle] = useActionState(
        saveTitleWithParams,
        undefined,
    )

    // Handle save font
    const saveFont = async (data: FormData) => {
        const result = await saveFontAction(bid, data)
        fireToastFeedback(addToast, result, 'Tekststørrelse lagret!')
        return result
    }

    // Handle move board
    const moveBoard = async () => {
        const result = await moveBoardAction(
            bid,
            personal ? undefined : selectedOrganization?.value.id,
            organization?.id,
        )
        fireToastFeedback(addToast, result, 'Organisasjon lagret!')
        return result
    }

    return (
        <>
            <form action={saveTitle} className="box flex flex-col">
                <Heading3 margin="bottom">Navn</Heading3>
                <div className="h-full">
                    <ClientOnlyTextField
                        name="name"
                        className="w-full"
                        defaultValue={meta?.title ?? DEFAULT_BOARD_NAME}
                        label="Navn på tavlen"
                        maxLength={50}
                    />
                </div>
                <FormError {...getFormFeedbackForField('name', titleState)} />

                <div className="flex flex-row justify-end mt-8">
                    <SubmitButton variant="secondary" className="max-sm:w-full">
                        Lagre navn
                    </SubmitButton>
                </div>
            </form>
            <Address bid={bid} location={meta?.location} />
            <form
                action={saveFont}
                className="box flex flex-col justify-between"
            >
                <Heading3 margin="bottom">Tekststørrelse </Heading3>
                <FontChoiceChip font={meta?.fontSize ?? 'medium'} />
                <div className="flex flex-row mt-8 justify-end">
                    <SubmitButton variant="secondary" className="max-sm:w-full">
                        Lagre tekststørrelse
                    </SubmitButton>
                </div>
            </form>
            <form action={moveBoard} className="box flex flex-col">
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
                    checked={personal}
                    onChange={() => setPersonal(!personal)}
                    name="personal"
                >
                    Privat tavle
                </Checkbox>
                <div className="flex flex-row mt-8 justify-end">
                    <SubmitButton variant="secondary" className="max-sm:w-full">
                        Lagre organisasjon
                    </SubmitButton>
                </div>
            </form>
        </>
    )
}

export { MetaSettings }
