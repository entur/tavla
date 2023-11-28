'use server'
import { cookies } from 'next/headers'

function logout() {
    cookies().delete('session')
}

export { logout }
