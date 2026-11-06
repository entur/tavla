'use client'

import { StarredIcon, UnstarredIcon } from '@entur/icons'
import {
    type Survey,
    type SurveyQuestion,
    SurveyQuestionType,
} from 'posthog-js'
import { usePostHog } from 'posthog-js/react'
import { useEffect, useState } from 'react'

export type SurveyState = 'UNANSWERED' | 'ANSWERED'

const getRatingBucket = (value: number) => {
    if (value <= 2) return 'negative'
    if (value === 3) return 'neutral'
    return 'positive'
}

export function PublishedBoardSurvey() {
    const postHogClient = usePostHog()
    const [survey, setSurvey] = useState<Survey | null>(null)
    const [surveyState, setSurveyState] = useState<SurveyState>('UNANSWERED')
    const [rating, setRating] = useState<number | null>(null)

    useEffect(() => {
        if (!postHogClient?.has_opted_in_capturing()) return
        postHogClient.getActiveMatchingSurveys((surveys: Survey[]) => {
            const firstSurvey = surveys.find((s) => s.type === 'api')

            if (firstSurvey) setSurvey(firstSurvey)
        })
    }, [postHogClient])

    if (!survey || !postHogClient?.has_opted_in_capturing()) return null

    const ratingQuestion = survey.questions[0]
    if (!ratingQuestion) return null
    if (ratingQuestion.type !== SurveyQuestionType.Rating) return null

    const getResponseKey = (question: SurveyQuestion) => {
        return `$survey_response_${question.id ?? survey.questions.indexOf(question)}`
    }

    const getFollowUpQuestion = (value: number): SurveyQuestion | null => {
        const branching = ratingQuestion.branching

        if (branching?.type !== 'response_based') return null

        const targetIndex = branching.responseValues[getRatingBucket(value)]

        return typeof targetIndex === 'number'
            ? (survey.questions[targetIndex] ?? null)
            : null
    }

    const followUpQuestion =
        rating === null ? null : getFollowUpQuestion(rating)

    const submitRating = (value: number) => {
        setRating(value)
        postHogClient?.capture('survey sent', {
            $survey_id: survey.id,
            $survey_submission_id: postHogClient?.get_session_id(),
            [getResponseKey(ratingQuestion)]: value,
            ...(getFollowUpQuestion(value) === null
                ? { $survey_completed: true }
                : {}),
        })
        if (value === 3) {
            setSurveyState('ANSWERED')
        }
    }

    const submitFollowUp = (question: SurveyQuestion, text: string) => {
        postHogClient?.capture('survey sent', {
            $survey_id: survey.id,
            $survey_submission_id: postHogClient?.get_session_id(),
            [getResponseKey(question)]: text,
            $survey_completed: true,
        })
        setSurveyState('ANSWERED')
    }

    if (surveyState === 'ANSWERED') {
        return <div>Takk for tilbakemeldingen!</div>
    }

    return (
        <div className="mt-2">
            <p>{ratingQuestion.question}</p>
            <div className="flex gap-1 justify-center">
                {Array.from(
                    { length: ratingQuestion.scale },
                    (_, i) => i + 1,
                ).map((value) => (
                    <button
                        key={value}
                        type="button"
                        aria-label={`${value} av ${ratingQuestion.scale}`}
                        onClick={() => submitRating(value)}
                    >
                        {rating !== null && value <= rating ? (
                            <StarredIcon />
                        ) : (
                            <UnstarredIcon />
                        )}
                    </button>
                ))}
            </div>
            {followUpQuestion && (
                <div className="mt-4">
                    <p>{followUpQuestion.question}</p>
                    <textarea
                        className="border rounded-md p-2 w-full"
                        onBlur={(e) => {
                            if (e.target.value.trim()) {
                                submitFollowUp(
                                    followUpQuestion,
                                    e.target.value.trim(),
                                )
                            }
                        }}
                    />
                </div>
            )}
        </div>
    )
}
