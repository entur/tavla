import DarkRotated from '../previews/direction-preview/dark_rotated.svg'
import DarkStandard from '../previews/direction-preview/dark_standard.svg'
import EnturRotated from '../previews/direction-preview/entur_rotated.svg'
import EnturStandard from '../previews/direction-preview/entur_standard.svg'
import GreyRotated from '../previews/direction-preview/grey_rotated.svg'
import GreyStandard from '../previews/direction-preview/grey_standard.svg'
import LightRotated from '../previews/direction-preview/light_rotated.svg'
import LightStandard from '../previews/direction-preview/light_standard.svg'


import { Direction, Theme } from '../../types'

export function DirectionPreview(
    theme: Theme | undefined,
    direction: Direction | undefined,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Record<string, any> {
    switch (theme) {
        case Theme.DARK:
            if(direction === Direction.STANDARD ){
                return {
                    DarkStandard
                }
            }
            else {
                return {
                    DarkRotated
                }
            }
           
        case Theme.GREY:
            if(direction === Direction.STANDARD ){
                return {
                    GreyStandard
                }
            }
            else {
                return {
                    GreyRotated
                }
            }
        case Theme.LIGHT:
            if(direction === Direction.STANDARD ){
                return {
                    LightStandard
                }
            }
            else {
                return {
                    LightRotated
                }
            }
        default:
            if(direction === Direction.STANDARD ){
                return {
                    EnturStandard
                }
            }
            else {
                return {
                    EnturRotated
                }
            }
    }
}
