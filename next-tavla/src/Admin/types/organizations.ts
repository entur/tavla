export const OrganizationsColumns = {
    name: 'Navn',
    role: 'Rolle',
    actions: 'Handlinger',
} as const

export type TOrganizationsColumn = keyof typeof OrganizationsColumns

export const ORGANIZATIONS_COLUMNS = Object.keys(
    OrganizationsColumns,
) as TOrganizationsColumn[]

export const MemberTableColumn = {
    email: 'E-post',
    actions: 'Valg',
}

export type TMemberTableColumn = keyof typeof MemberTableColumn
export const MEMBER_TABLE_COLUMNS = Object.keys(
    MemberTableColumn,
) as TMemberTableColumn[]
