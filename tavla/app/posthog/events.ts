import { TLoginPage } from 'app/(admin)/components/Login/types'

export const LOCATIONS = {
    LandingPage: 'landing_page',
    NavBar: 'nav_bar',
    DemoPage: 'demo_page',
    Footer: 'footer',
    UserModal: 'user_modal',
    Admin: 'admin',
    Folder: 'folder',
    BoardPage: 'board_page',
    AdminTable: 'admin_table',
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

    user_create_cancelled: WithLocation<typeof LOCATIONS.UserModal> & {
        method: 'cancel_button' | 'close_icon'
    }

    user_login_started:
        | WithLocation<
              | typeof LOCATIONS.DemoPage
              | typeof LOCATIONS.NavBar
              | typeof LOCATIONS.LandingPage
          >
        | (WithLocation<typeof LOCATIONS.UserModal> & {
              context?: TLoginPage
          })

    user_login_method_selected: WithLocation<typeof LOCATIONS.UserModal> & {
        method: 'email' | 'google'
        context: TLoginPage
    }

    user_modal_closed: {
        context: TLoginPage
    }

    user_forgot_password: WithLocation<typeof LOCATIONS.UserModal>

    user_log_out_started: WithLocation<typeof LOCATIONS.NavBar>

    /* Oversikt */
    board_create_started: WithLocation<
        typeof LOCATIONS.Admin | typeof LOCATIONS.Folder
    >

    board_created: {
        folder_selected: boolean
    }

    board_create_cancelled: {
        method: 'dismissed' | 'close_icon' | 'cancel_button'
    }

    folder_create_started: void

    folder_created: void

    folder_create_cancelled: {
        method: 'dismissed' | 'close_icon' | 'cancel_button'
    }

    /* Mapper */

    folder_logo_upload_started: WithLocation<typeof LOCATIONS.Folder> & {
        folder_id: string
    }

    folder_logo_upload_cancelled: WithLocation<typeof LOCATIONS.Folder> & {
        folder_id: string
        method: 'dismissed' | 'cancel_button'
    }

    folder_logo_uploaded: WithLocation<typeof LOCATIONS.Folder> & {
        folder_id: string
    }

    folder_members_manage_started: WithLocation<typeof LOCATIONS.Folder> & {
        folder_id: string
    }

    folder_members_manage_cancelled: WithLocation<typeof LOCATIONS.Folder> & {
        folder_id: string
        method: 'dismissed'
    }

    folder_members_managed: WithLocation<typeof LOCATIONS.Folder> & {
        folder_id: string
        method: 'removed' | 'invited'
    }

    folder_delete_started: WithLocation<typeof LOCATIONS.Folder> & {
        folder_id: string
    }

    folder_delete_cancelled: WithLocation<typeof LOCATIONS.Folder> & {
        folder_id: string
        method: 'cancelled' | 'dismissed' | 'close_icon'
    }

    folder_deleted: WithLocation<typeof LOCATIONS.Folder> & {
        folder_id: string
    }

    /* Tavler */

    board_opened: WithLocation<
        typeof LOCATIONS.BoardPage | typeof LOCATIONS.AdminTable
    > & {
        board_id: string
    }

    board_copied: WithLocation<
        typeof LOCATIONS.BoardPage | typeof LOCATIONS.AdminTable
    > & {
        board_id: string
    }

    board_deleted: WithLocation<
        typeof LOCATIONS.BoardPage | typeof LOCATIONS.AdminTable
    > & {
        board_id: string
    }

    board_published: WithLocation<typeof LOCATIONS.BoardPage> & {
        board_id: string
    }

    stop_place_deleted: WithLocation<
        typeof LOCATIONS.BoardPage | typeof LOCATIONS.DemoPage
    > & {
        board_id: string
    }

    stop_place_edit_started: WithLocation<
        typeof LOCATIONS.BoardPage | typeof LOCATIONS.DemoPage
    > & {
        board_id: string
    }

    stop_place_edit_cancelled: WithLocation<
        typeof LOCATIONS.BoardPage | typeof LOCATIONS.DemoPage
    > & {
        board_id: string
    }

    stop_place_edit_interaction: WithLocation<
        typeof LOCATIONS.BoardPage | typeof LOCATIONS.DemoPage
    > & {
        board_id: string
        field: 'name' | 'offset' | 'offset_walking_dist' | 'columns' | 'lines'
        action:
            | 'changed'
            | 'toggled_on'
            | 'toggled_off'
            | 'select_all'
            | 'cleared'
            | 'opened'
            | 'closed'
        column_value:
            | 'eta'
            | 'arrival'
            | 'line'
            | 'destination'
            | 'stop_place'
            | 'platform'
            | 'expected'
            | 'none'
    }

    stop_place_edit_saved: WithLocation<
        typeof LOCATIONS.BoardPage | typeof LOCATIONS.DemoPage
    > & {
        board_id: string
    }

    stop_place_add_interaction: WithLocation<
        typeof LOCATIONS.BoardPage | typeof LOCATIONS.DemoPage
    > & {
        field: 'county' | 'stop_place' | 'platform'
        action: 'selected' | 'cleared'
    }

    stop_place_added: WithLocation<
        typeof LOCATIONS.BoardPage | typeof LOCATIONS.DemoPage
    > & {
        county_selected: boolean
        county_count: number
        platform_selected: boolean
    }

    board_settings_changed: {
        setting:
            | 'view_type'
            | 'theme'
            | 'font'
            | 'transport_palette'
            | 'title'
            | 'board_location'
            | 'info_message'
            | 'element_select'
        value:
            | 'combined'
            | 'separate'
            | 'light'
            | 'dark'
            | 'small'
            | 'medium'
            | 'large'
            | 'default'
            | 'blue-bus'
            | 'green-bus'
            | 'atb'
            | 'fram'
            | 'reis'
            | 'changed'
            | 'clock'
            | 'logo'
    }

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
    contact_form_opened: void
    contact_form_closed: void
    contact_form_email_disabled: { disabled: boolean }
    contact_form_submitted: void

    /* Other */
    admin_page_opened: WithLocation<Location>
    go_to_home_page: WithLocation<typeof LOCATIONS.NavBar>
    contact_customer_service: WithLocation<typeof LOCATIONS.Footer>
    contact_tavla: WithLocation<typeof LOCATIONS.Footer>
    cookie_settings_opened: WithLocation<typeof LOCATIONS.Footer>
    github_link_clicked: WithLocation<typeof LOCATIONS.Footer>
}
export type NoProps = void

export type TrackingEvent = keyof EventMap
export type EventProps<E extends TrackingEvent> = EventMap[E]

export type CaptureArgs<E extends TrackingEvent> =
    EventProps<E> extends NoProps ? [] : [properties: EventProps<E>]
