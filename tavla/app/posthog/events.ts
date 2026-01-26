import { TLoginPage } from 'app/(admin)/components/Login/types'

export const LOCATIONS = {
    LandingPage: 'landing_page',
    NavBar: 'nav_bar',
    DemoPage: 'demo_page',
    Footer: 'footer',
    UserModal: 'user_modal',
} as const

type Location = (typeof LOCATIONS)[keyof typeof LOCATIONS]
type WithLocation<L extends Location> = { location: L }

export type EventMap = {
    /* User: create and login */
    user_create_started: WithLocation<
        | typeof LOCATIONS.DemoPage
        | typeof LOCATIONS.NavBar
        | typeof LOCATIONS.LandingPage
        | typeof LOCATIONS.UserModal
    >

    user_create_method_selected: WithLocation<typeof LOCATIONS.UserModal> & {
        method: 'email' | 'google'
    }

    user_create_cancelled: WithLocation<typeof LOCATIONS.UserModal>

    login_started:
        | WithLocation<
              | typeof LOCATIONS.DemoPage
              | typeof LOCATIONS.NavBar
              | typeof LOCATIONS.LandingPage
          >
        | (WithLocation<typeof LOCATIONS.UserModal> & {
              context?: TLoginPage
          })

    login_method_selected: WithLocation<typeof LOCATIONS.UserModal> & {
        method: 'email' | 'google'
        context: TLoginPage
    }

    login_aborted: WithLocation<typeof LOCATIONS.UserModal>

    user_modal_closed: WithLocation<typeof LOCATIONS.UserModal> & {
        context: TLoginPage
    }

    user_forgot_password: WithLocation<typeof LOCATIONS.UserModal>

    log_out_started: WithLocation<typeof LOCATIONS.NavBar>

    /* Demo */
    demo_started: WithLocation<
        | typeof LOCATIONS.NavBar
        | typeof LOCATIONS.LandingPage
        | typeof LOCATIONS.Footer
    >

    /* FAQ */
    faq_link_clicked: WithLocation<
        typeof LOCATIONS.Footer | typeof LOCATIONS.NavBar
    >

    /* Contact form */
    contact_form_opened: WithLocation<Location>
    contact_form_closed: WithLocation<Location>
    contact_form_hide_email: WithLocation<Location>
    contact_form_submitted: WithLocation<Location>

    /* Other */
    admin_page_opened: WithLocation<Location>
    go_to_home_page: WithLocation<typeof LOCATIONS.NavBar>
}

export type TrackingEvent = keyof EventMap
export type EventProps<E extends TrackingEvent> = EventMap[E]
