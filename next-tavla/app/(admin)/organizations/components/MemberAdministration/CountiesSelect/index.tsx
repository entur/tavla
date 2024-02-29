'use client'
import { NormalizedDropdownItemType } from '@entur/dropdown'
import { SecondaryButton } from '@entur/button'
import { TCountyID, TOrganizationID } from 'types/settings'
import { useCountiesSearch } from 'app/(admin)/hooks/useCountiesSearch'
import { Checkbox } from '@entur/form'
import { setCounties } from './actions'
import classes from '../styles.module.css'
import { Heading3, Paragraph } from '@entur/typography'

function CountiesSelect({
    oid,
    countiesList,
}: {
    oid?: TOrganizationID
    countiesList?: TCountyID[]
}) {
    const { counties } = useCountiesSearch(oid)

    return (
        <div>
            <Heading3>Velg fylkene du vil sette opp tavler for</Heading3>
            <div className="box">
                <Paragraph>
                    Når du søker etter stoppesteder vil du søke i alle fylker.
                    Her kan du velge hvilke fylker du ønsker å begrense søket
                    til.
                </Paragraph>
                <form
                    action={async (data: FormData) => {
                        const counties = data.getAll('county') as string[]

                        if (!oid) return null
                        setCounties(oid, counties)
                    }}
                >
                    <div className={classes.countiesSelectContainer}>
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
                    <div className="flexRow w-100 mt-4 mr-2 justifyEnd">
                        <SecondaryButton
                            type="submit"
                            aria-label="Lagre fylker"
                        >
                            Lagre fylker
                        </SecondaryButton>
                    </div>
                </form>
            </div>
        </div>
    )
}

export { CountiesSelect }
