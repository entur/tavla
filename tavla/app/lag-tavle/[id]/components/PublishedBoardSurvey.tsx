'use client'

import { IconButton, PrimaryButton } from '@entur/button'
import { Fieldset, TextArea } from '@entur/form'
import { StarredIcon, UnstarredIcon } from '@entur/icons'
import { Paragraph } from '@entur/typography'
import {
    type Survey,
    type SurveyQuestion,
    SurveyQuestionType,
} from 'posthog-js'
import { usePostHog } from 'posthog-js/react'
import { useEffect, useState } from 'react'

const SURVEY_NAME = 'Survey anonym tavle'

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
    const [answer, setAnswer] = useState('')

    useEffect(() => {
        if (!postHogClient?.has_opted_in_capturing()) return
        postHogClient.getActiveMatchingSurveys((surveys: Survey[]) => {
            const firstSurvey = surveys.find((s) => s.name === SURVEY_NAME)

            if (firstSurvey) setSurvey(firstSurvey)
        })
    }, [postHogClient])

    useEffect(() => {
        if (!survey) return
        const firstQuestion = survey.questions[0]
        if (!firstQuestion || firstQuestion.type !== SurveyQuestionType.Rating)
            return
        postHogClient?.capture('survey shown', { $survey_id: survey.id })
    }, [postHogClient, survey])

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

    return (
        <div className="mt-8 mb-16 rounded bg-tintLight p-6">
            {surveyState === 'ANSWERED' ? (
                <Paragraph>Takk for tilbakemeldingen!</Paragraph>
            ) : (
                <>
                    <Fieldset
                        label={ratingQuestion.question}
                        className="flex flex-col items-center"
                    >
                        <div className="flex justify-center mt-2">
                            {Array.from(
                                { length: ratingQuestion.scale },
                                (_, i) => i + 1,
                            ).map((value) => (
                                <IconButton
                                    key={value}
                                    aria-label={`${value} av ${ratingQuestion.scale}`}
                                    onClick={() => submitRating(value)}
                                >
                                    {rating !== null && value <= rating ? (
                                        <StarredIcon size={32} />
                                    ) : (
                                        <UnstarredIcon size={32} />
                                    )}
                                </IconButton>
                            ))}
                        </div>
                    </Fieldset>
                    {followUpQuestion && (
                        <div className="mt-8">
                            <Fieldset label={followUpQuestion.question}>
                                <TextArea
                                    label="Din tilbakemelding"
                                    disableLabelAnimation
                                    value={answer}
                                    className="p-2 w-full mt-2"
                                    onChange={(e) => setAnswer(e.target.value)}
                                />
                                <PrimaryButton
                                    onClick={() =>
                                        submitFollowUp(
                                            followUpQuestion,
                                            answer.trim(),
                                        )
                                    }
                                >
                                    Send inn
                                </PrimaryButton>
                            </Fieldset>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
