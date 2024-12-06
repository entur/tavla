'use client'
import { NormalizedDropdownItemType } from '@entur/dropdown'
import { TCountyID, TOrganizationID } from 'types/settings'
import { useCountiesSearch } from 'app/(admin)/hooks/useCountiesSearch'
import { Checkbox } from '@entur/form'
import { setCounties as setCountiesAction } from './actions'
import { Heading2, Paragraph } from '@entur/typography'
import { useToast } from '@entur/alert'
import { SubmitButton } from 'components/Form/SubmitButton'

function CountiesSelect({
    oid,
    countiesList,
}: {
    oid?: TOrganizationID
    countiesList?: TCountyID[]
}) {
    const { counties } = useCountiesSearch(oid)
    const { addToast } = useToast()

    const setCounties = async (data: FormData) => {
        const formFeedback = await setCountiesAction(oid, data)
        if (!formFeedback) {
            addToast('Fylker lagret!')
        }
    }

    return (
        <div className="box flex flex-col gap-1">
            <Heading2>Fylker</Heading2>
            <Paragraph>
                Velg hvilke fylker som skal være standard når det opprettes en
                ny tavle.
            </Paragraph>
            <form action={setCounties}>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-2">
                    {counties()
                        .sort(
                            (
                                countyA: NormalizedDropdownItemType,
                                countyB: NormalizedDropdownItemType,
                            ) => countyA.label.localeCompare(countyB.label),
                        )
                        .map((county: NormalizedDropdownItemType) => (
                            <Checkbox
                                key={county.value}
                                defaultChecked={
                                    countiesList?.includes(county.value) ??
                                    false
                                }
                                name="county"
                                value={county.value}
                            >
                                {county.label}
                            </Checkbox>
                        ))}
                </div>
                <div className="flex flex-row w-full mt-8 justify-end">
                    <SubmitButton
                        variant="secondary"
                        aria-label="Lagre fylker"
                        className="max-sm:w-full"
                    >
                        Lagre fylker
                    </SubmitButton>
                </div>
            </form>
        </div>
    )
}

export { CountiesSelect }
