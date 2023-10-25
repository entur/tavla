export const OrganizationsColumns = {
    name: 'Navn',
    actions: 'Handlinger',
    role: 'Rolle',
} as const

export type TOrganizationsColumn = keyof typeof OrganizationsColumns
