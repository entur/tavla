'use client'
import { Button } from '@entur/button'
import { TextField } from '@entur/form'
import { Contrast } from 'Admin/components/Contrast'
import { ChangeEventHandler, useState } from 'react'
import { TOrganization } from 'types/settings'

function FooterInfoInput({ organzation }: { organzation: TOrganization }) {
    const [info, setOrgInfo] = useState<string>(organzation.footer ?? '')
    const setInfo: ChangeEventHandler<HTMLInputElement> = (e) => {
        if (!e.target) return
        setOrgInfo(e.target.value)
    }

    return (
        <div className="flexColumn g-1 w-100">
            <TextField
                name="info"
                label="Informasjon"
                value={info}
                onChange={setInfo}
            />
            <Contrast>
                <Button className="w-100" variant="secondary" type="submit">
                    Lagre
                </Button>
            </Contrast>
        </div>
    )
}

export { FooterInfoInput }
