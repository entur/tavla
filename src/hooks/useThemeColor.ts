import { useSettings } from '../settings/SettingsProvider'

const useThemeColor = (
    color: { [key: string]: string },
    fallback: string,
): string => {
    const [settings] = useSettings()
    return color[settings.theme] || fallback
}

export { useThemeColor }
