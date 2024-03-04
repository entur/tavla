'use client'
import { useToast } from '@entur/alert'
import { FilterChip } from '@entur/chip'
import { SubmitButton } from 'components/Form/SubmitButton'
import React from 'react'
import { Columns, TColumn } from 'types/column'
import { TOrganizationID } from 'types/settings'
import { saveColumns } from './actions'

function FilterColumns({
    oid,
    columns,
}: {
    oid?: TOrganizationID
    columns?: TColumn[]
}) {
    const { addToast } = useToast()

    return (
        <div>
            <form
                action={async (data: FormData) => {
                    const columns = data.getAll('columns') as TColumn[]

                    if (!oid) return null

                    saveColumns(oid, columns)
                }}
            >
                <div className="flexRow flexWrap g-2">
                    {Object.entries(Columns).map(([key, information]) => (
                        <FilterChip
                            key={key}
                            value={key}
                            defaultChecked={
                                (columns && columns.includes(key as TColumn)) ??
                                false
                            }
                            name="columns"
                        >
                            {information}
                        </FilterChip>
                    ))}
                </div>
                <div className="flexRow w-100 mt-4 mr-2 justifyEnd">
                    <SubmitButton
                        variant="secondary"
                        aria-label="Lagre kolonner"
                        onClick={() => addToast('Lagret kolonner!')}
                    >
                        Lagre kolonner
                    </SubmitButton>
                </div>
            </form>
        </div>
    )
}

export default FilterColumns
