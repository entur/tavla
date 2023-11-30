import { IllustratedInfo } from '../IllustratedInfo'

function IllustratedNotFound(props: { title: string; description: string }) {
    return (
        <div className="eds-contrast w-100 h-100 flexRow justifyCenter alignCenter">
            <div className="p-2">
                <IllustratedInfo {...props} />
            </div>
        </div>
    )
}

export { IllustratedNotFound }
