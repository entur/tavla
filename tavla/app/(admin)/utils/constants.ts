import { TTableColumn, TSort } from './types'

export const DEFAULT_BOARD_NAME = 'Tavle uten navn'
export const DEFAULT_FOLDER_NAME = 'Mappe uten navn'

export const DEFAULT_SORT_COLUMN: TTableColumn = 'lastModified'
export const DEFAULT_SORT_TYPE: TSort = 'descending'

export const FIREBASE_DEV_CONFIG = {
    apiKey: 'AIzaSyCjyL7k4AehY4M95cxBVaW4LJTy6JNdTjo',
    authDomain: 'ent-tavla-dev.firebaseapp.com',
    projectId: 'ent-tavla-dev',
    storageBucket: 'ent-tavla-dev.appspot.com',
    messagingSenderId: '992979087014',
    appId: '1:992979087014:web:3af389943fe02c0cf34e67',
}

export const FIREBASE_PRD_CONFIG = {
    apiKey: 'AIzaSyCYIqxsPo2mJ8dupGENDWAECO6JYXm4iRk',
    authDomain: 'ent-tavla-prd.firebaseapp.com',
    projectId: 'ent-tavla-prd',
    storageBucket: 'ent-tavla-prd.appspot.com',
    messagingSenderId: '206753066197',
    appId: '1:206753066197:web:c136b4473eeff99e24c65c',
}
