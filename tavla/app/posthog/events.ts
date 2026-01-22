export enum NAVBAR {
    MY_BOARDS_BTN = 'MY_BOARDS_FROM_NAV_BAR_BTN',
    FAQ_BTN = 'FAQ_FROM_NAV_BAR_BTN',
}

export enum FOOTER {
    DEMO_LINK = 'DEMO_FROM_FOOTER',
}

export enum LANDING_PAGE {
    DEMO_BTN = 'DEMO_BTN_FROM_LANDING',
}

export enum DEMO {
    DEMO_BTN = 'DEMO_BTN',
}

export enum FAQ {
    FAQ_BTN = 'FAQ_BTN',
}

export enum Events {
    BOARD_CREATE = 'create_board', //oppretter en tavle {location: BoardCreateLocation}
    CreateUser = 'create_user', //oppretter en bruker {location: UserCreateLocation}
}

export enum BoardCreateLocation {
    Admin = 'admin',
    Folder = 'folder',
}
export enum UserCreateLocation {
    LandingPage = 'landing_page',
    NavBar = 'nav_bar',
    DemoPage = 'demo_page',
}
