import { ReactNode } from 'react'

async function AdminLayout({ children }: { children: ReactNode }) {
    return <main>{children}</main>
}

export default AdminLayout
