'use client'
import { ChangeEventHandler, useState } from 'react'
import { TOrganization } from 'types/settings'

function FooterInfoInput({ organzation }: { organzation: TOrganization }) {
    const [info, setOrgInfo] = useState<string>(organzation.footer ?? '')
    const setInfo: ChangeEventHandler<HTMLInputElement> = (e) => {
        if (!e.target) return
        setOrgInfo(e.target.value)
    }

    return (
        <div className="infoForm">
            <label htmlFor="info">
                <input
                    type="text"
                    name="info"
                    id="info"
                    onChange={setInfo}
                    value={info}
                    className="w-100 mb-2 h-2rem"
                />
            </label>
            <button
                type="submit"
                className="secondaryButton w-100 justifyCenter"
            >
                Legg til informasjon
            </button>
        </div>
    )
}

export { FooterInfoInput }
