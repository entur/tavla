'use client'
import { NormalizedDropdownItemType } from '@entur/dropdown'
import { PrimaryButton } from '@entur/button'
import { TCountyID, TOrganizationID } from 'types/settings'
import { useCountiesSearch } from 'app/(admin)/hooks/useCountiesSearch'
import { Checkbox } from '@entur/form'
import { setCounties } from './actions'
import styles from '../styles.module.css'
function CountiesSelect({
    oid,
    countiesList,
}: {
    oid?: TOrganizationID
    countiesList?: TCountyID[]
}) {
    const { counties } = useCountiesSearch(oid)

    return (
        <>
            <form
                action={async (data: FormData) => {
                    const counties = data.getAll('county') as string[]

                    if (!oid) return null
                    setCounties(oid, counties)
                }}
            >
                <div
                    className={`flexColumn flexWrap ${styles.countiesSelectContainer}`}
                >
                    {counties()
                        .sort(
                            (
                                countyA: NormalizedDropdownItemType,
                                countyB: NormalizedDropdownItemType,
                            ) => countyA.label.localeCompare(countyB.label),
                        )
                        .map((county: NormalizedDropdownItemType) => (
                            <>
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
                            </>
                        ))}
                </div>
                <PrimaryButton
                    type="submit"
                    className="mt-2"
                    aria-label="Lagre fylker"
                >
                    Lagre fylker
                </PrimaryButton>
            </form>
        </>
    )
}

export { CountiesSelect }
