export const OrganizationsColumns = {
    name: 'Navn',
    role: 'Rolle',
    actions: 'Handlinger',
} as const

export type TOrganizationsColumn = keyof typeof OrganizationsColumns

export const ORGANIZATIONS_COLUMNS = Object.keys(
    OrganizationsColumns,
) as TOrganizationsColumn[]
