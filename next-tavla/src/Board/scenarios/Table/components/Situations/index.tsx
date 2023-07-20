import { Situation } from '../Situation'
import { useNonNullContext } from 'hooks/useNonNullContext'
import { DepartureContext } from '../../contexts'
import { useEffect, useState } from 'react'

function Situations() {
    //number decided based on 1920x1080 screen
    const numOfCharacters = 85
    const departure = useNonNullContext(DepartureContext)

    function splitLongSituation(situationText: string) {
        const splitSituation = []
        for (let i = 0; i < situationText.length; i += numOfCharacters) {
            const splitText = situationText.substring(i, i + numOfCharacters)
            if (i == 0) {
                splitSituation.push(splitText + '...')
            } else if (i + numOfCharacters < situationText.length)
                splitSituation.push('...' + splitText + '...')
            else splitSituation.push('...' + splitText)
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
            return []
        }
        if (situationText.length <= numOfCharacters) {
            return [situationText]
        } else return splitLongSituation(situationText)
    })

    const mappedSituationText = situationsText.reduce((accList, textList) => {
        return [...accList, ...textList]
    }, [])
    const numberOfSituations = mappedSituationText.length

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
                    situationText={
                        mappedSituationText[index % numberOfSituations]
                    }
                />
            ) : null}
        </td>
    )
}
export { Situations }
