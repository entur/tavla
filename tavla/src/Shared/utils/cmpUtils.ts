'use client'

declare global {
    interface Window {
        __ucCmp: {
            getConsentDetails: () => Promise<ConsentDetails>
            acceptAllConsents: () => Promise<void>
            changeLanguage: (language: string) => Promise<void>
            getActiveLanguage: () => Promise<string>
            denyAllConsents: () => Promise<void>
            updateServicesConsents: (serviceConsents: {
                id: string
                consent: boolean
            }) => Promise<void>
            closeCmp: () => Promise<void>
            showFirstLayer: () => Promise<void>
            getControllerId: () => Promise<string>
        }
        UC_UI: {
            isInitialized: () => boolean
            showFirstLayer: () => void
            showSecondLayer: () => void
        }
    }
}

export type ConsentActionType =
    | 'onAcceptAllServices'
    | 'onDenyAllServices'
    | 'onEssentialChange'
    | 'onInitialPageLoad'
    | 'onNonEURegion'
    | 'onSessionRestored'
    | 'onTcfStringChange'
    | 'onUpdateServices'
    | 'onMobileSessionRestore'

type SettingType = 'TCF' | 'GDPR' | 'CCPA'

type ConsentType = 'IMPLICIT' | 'EXPLICIT'

export interface ConsentDetails {
    consent: ConsentData
    services: Record<string, ServiceData>
    categories: Record<string, CategoryData>
}

interface ConsentData {
    status: 'ALL_ACCEPTED' | 'ALL_DENIED' | 'SOME_ACCEPTED' | 'SOME_DENIED'
    serviceIds?: string[]
    required: boolean
    version: number
    controllerId: string
    language: string
    createdAt: number
    updatedAt: number
    updatedBy: ConsentActionType
    setting: SettingData
    type: ConsentType
    hash: string
    gpcSignal?: boolean
    isBot?: true
    isOutsideEu?: true
}

interface SettingData {
    id: string
    type: SettingType
    version: string
    abVariant?: string
    sandbox?: true
}

interface ServiceData {
    name: string
    version: string
    category: string
    essential: boolean
    consent?: {
        given: boolean
        type: 'IMPLICIT' | 'EXPLICIT'
    }
    gcm?: {
        analyticsStorage?: true
        adStorage?: true
    }
    subservices?: Record<string, ServiceData>
    thirdCountryDataTransfer?: boolean
    status?: 'added'
}

interface CategoryData {
    essential?: boolean
    state: 'ALL_DENIED' | 'SOME_ACCEPTED' | 'ALL_ACCEPTED'
    dps: Record<string, boolean> | null
    hidden?: boolean
}

export const CMP_INITIALIZE_EVENT = 'UC_UI_INITIALIZED'

export const CONSENT_UPDATED_EVENT = 'UC_CONSENT'

export type Consents =
    | {
          id: string
          name: string
          consentGiven: boolean
          category: string
      }[]
    | undefined

export function getCMP() {
    return typeof window !== 'undefined' ? window.__ucCmp : null
}

/** Accepts an event sent by the UC_CONSENT event from Usercentrics CMP
 *  and returns an array of services and their consent status
 */
export function formatConsentEvent(
    event: Event & { detail?: ConsentDetails },
): Consents {
    return Object.entries(event?.detail?.services ?? {}).map((service) => {
        return {
            id: service[0],
            name: service[1].name,
            consentGiven: service[1].consent?.given ?? false,
            category: service[1].category,
        }
    })
}

export function formatConsentDetails(consentDetails: ConsentDetails): Consents {
    return Object.entries(consentDetails?.services ?? {}).map((service) => {
        return {
            id: service[0],
            name: service[1].name,
            consentGiven: service[1].consent?.given ?? false,
            category: service[1].category,
        }
    })
}

export function waitFor(conditionFunction: () => boolean, interval = 100) {
    return new Promise((resolve) => {
        const check = () => {
            if (conditionFunction()) {
                resolve(true)
            } else {
                setTimeout(check, interval)
            }
        }
        check()
    })
}
