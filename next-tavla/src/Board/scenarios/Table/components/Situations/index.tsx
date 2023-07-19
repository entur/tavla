import { Situation } from '../Situation'
import { useNonNullContext } from 'hooks/useNonNullContext'
import { DepartureContext } from '../../contexts'
import { useEffect, useState } from 'react'

function Situations() {
    const departure = useNonNullContext(DepartureContext)

    function splitLongSituation(situationText: string) {
        const splitSituation = []
        const numOfCharacters = 100
        for (let i = 0; i < situationText.length; i += numOfCharacters) {
            splitSituation.push(situationText.substring(i, i + numOfCharacters))
        }
        return splitSituation
    }

    const situationsText = departure.situations.map((situation) => {
        const situationText =
            situation.summary.find((summary) => summary.language === 'no')
                ?.value ??
            situation.description.find((desc) => desc.language === 'no')
                ?.value ??
            null
        if (!situationText) {
            return ''
        }
        if (situationText.length < 100) {
            return [situationText]
        } else return splitLongSituation(situationText)
    })
    console.log(situationsText)

    const numberOfSituations = situationsText.length
    const [index, setIndex] = useState(0)

    useEffect(() => {
        if (numberOfSituations <= 1) {
            return
        }
        const interval = setInterval(() => setIndex((i) => i + 1), 5000)
        return () => clearInterval(interval)
    }, [numberOfSituations])

    return (
        <td>
            {numberOfSituations ? (
                <Situation
                    situationText={situationsText[index % numberOfSituations]}
                />
            ) : null}
        </td>
    )
}
export { Situations }
