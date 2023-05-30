/* eslint-disable */
import type * as Types from 'types/graphql-schema'

import type { DocumentTypeDecoration } from '@graphql-typed-document-node/core'
export type TLinesFragment = {
    __typename?: 'Quay'
    lines: Array<{
        __typename?: 'Line'
        id: string
        publicCode: string | null
        name: string | null
    }>
}

export type TQuaysSearchQueryVariables = Types.Exact<{
    stopPlaceId: Types.Scalars['String']
}>

export type TQuaysSearchQuery = {
    __typename?: 'QueryType'
    stopPlace: {
        __typename?: 'StopPlace'
        quays: Array<{
            __typename?: 'Quay'
            id: string
            publicCode: string | null
            description: string | null
        } | null> | null
    } | null
}

export type TStopPlaceSettingsQueryVariables = Types.Exact<{
    id: Types.Scalars['String']
}>

export type TStopPlaceSettingsQuery = {
    __typename?: 'QueryType'
    stopPlace: {
        __typename?: 'StopPlace'
        name: string
        quays: Array<{
            __typename?: 'Quay'
            lines: Array<{
                __typename?: 'Line'
                id: string
                publicCode: string | null
                name: string | null
            }>
        } | null> | null
    } | null
}

export class TypedDocumentString<TResult, TVariables>
    extends String
    implements DocumentTypeDecoration<TResult, TVariables>
{
    __apiType?: DocumentTypeDecoration<TResult, TVariables>['__apiType']

    constructor(private value: string, public __meta__?: Record<string, any>) {
        super(value)
    }

    toString(): string & DocumentTypeDecoration<TResult, TVariables> {
        return this.value
    }
}
export const LinesFragment = new TypedDocumentString(
    `
    fragment lines on Quay {
  lines {
    id
    publicCode
    name
  }
}
    `,
    { fragmentName: 'lines' },
) as unknown as TypedDocumentString<TLinesFragment, unknown>
export const QuaysSearchQuery = new TypedDocumentString(`
    query quaysSearch($stopPlaceId: String!) {
  stopPlace(id: $stopPlaceId) {
    quays(filterByInUse: true) {
      id
      publicCode
      description
    }
  }
}
    `) as unknown as TypedDocumentString<
    TQuaysSearchQuery,
    TQuaysSearchQueryVariables
>
export const StopPlaceSettingsQuery = new TypedDocumentString(`
    query StopPlaceSettings($id: String!) {
  stopPlace(id: $id) {
    name
    quays(filterByInUse: true) {
      ...lines
    }
  }
}
    fragment lines on Quay {
  lines {
    id
    publicCode
    name
  }
}`) as unknown as TypedDocumentString<
    TStopPlaceSettingsQuery,
    TStopPlaceSettingsQueryVariables
>
