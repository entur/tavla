import { useNonNullContext } from 'hooks/useNonNullContext'
import { createContext } from 'react'
import { TOrganization, TUserID } from 'types/settings'

export type TUserOrganizationContext = {
    userId: TUserID
    organizations: TOrganization[]
}

export const UserOrganizationsContext = createContext<
    TUserOrganizationContext | undefined
>(undefined)

export function useUserOrganizations() {
    return useNonNullContext(UserOrganizationsContext)
}
