import { useEffect, useState } from 'react'

function useOrganizationName(bid?: string) {
    const [organizationName, setOrganizationName] = useState()

    useEffect(() => {
        fetch(`/api/organization/board/${bid}`)
            .then((res) => res.json())
            .then((data) => {
                setOrganizationName(data.organization?.name)
            })
    }, [bid])

    return organizationName
}

export { useOrganizationName }
