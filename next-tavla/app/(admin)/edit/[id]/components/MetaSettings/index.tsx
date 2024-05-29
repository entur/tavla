'use client'
import { TextField } from '@entur/form'
import { Heading3 } from '@entur/typography'
import { TFontSize, TMeta } from 'types/meta'
import { saveFont, saveTitle } from './actions'
import { TBoardID, TOrganizationID } from 'types/settings'
import { FontChoiceChip } from './FontChoiceChip'
import { SubmitButton } from 'components/Form/SubmitButton'
import { Address } from './Adress'
import { DEFAULT_BOARD_NAME } from 'app/(admin)/utils/constants'
import { useToast } from '@entur/alert'
import { isEmptyOrSpaces } from 'app/(admin)/edit/utils'
import { Dropdown } from '@entur/dropdown'
import { useOrganizationSearch } from './useOrganizationSearch'

function MetaSettings({
    bid,
    meta,
    oid,
}: {
    bid: TBoardID
    meta?: TMeta
    oid?: TOrganizationID
}) {
    const { addToast } = useToast()
    const { organizations, selectedOrganization, setSelectedOrganization } =
        useOrganizationSearch(oid ?? undefined)
    return (
        <>
            <form
                action={async (data: FormData) => {
                    const name = data.get('name') as string
                    if (isEmptyOrSpaces(name))
                        return addToast({
                            content:
                                'Navnet kan ikke være tomt eller bare mellomrom!',
                            variant: 'info',
                        })
                    await saveTitle(bid, name)
                    addToast('Tittel lagret!')
                }}
                className="box flex flex-col"
            >
                <Heading3 margin="bottom">Navn</Heading3>
                <div className="h-full">
                    <TextField
                        name="name"
                        className="w-full"
                        defaultValue={meta?.title ?? DEFAULT_BOARD_NAME}
                        label="Navn på tavlen"
                        maxLength={30}
                    />
                </div>

                <div className="flex flex-row justify-end mt-8">
                    <SubmitButton variant="secondary" className="max-sm:w-full">
                        Lagre navn
                    </SubmitButton>
                </div>
            </form>
            <Address bid={bid} location={meta?.location} />
            <form
                action={async (data: FormData) => {
                    const font = data.get('font') as TFontSize
                    await saveFont(bid, font)
                    addToast('Tekststørrelse lagret!')
                }}
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
            <form className="box flex flex-col">
                <Heading3 margin="bottom">Organisasjon</Heading3>
                <Dropdown
                    items={organizations}
                    selectedItem={selectedOrganization}
                    onChange={() =>
                        setSelectedOrganization(selectedOrganization)
                    }
                    label="Organisasjon"
                    clearable
                />
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
