import type * as Types from 'types/graphql-schema'

import type { DocumentTypeDecoration } from '@graphql-typed-document-node/core'
export type TGetQuaysSearchQueryVariables = Types.Exact<{
    stopPlaceId: Types.Scalars['String']
}>

export type TGetQuaysSearchQuery = {
    __typename?: 'QueryType'
    stopPlace?: {
        __typename?: 'StopPlace'
        quays?: Array<{
            __typename?: 'Quay'
            id: string
            publicCode?: string | null
            description?: string | null
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

export const GetQuaysSearchQuery = new TypedDocumentString(`
    query getQuaysSearch($stopPlaceId: String!) {
  stopPlace(id: $stopPlaceId) {
    quays(filterByInUse: true) {
      id
      publicCode
      description
    }
  }
}
    `) as unknown as TypedDocumentString<
    TGetQuaysSearchQuery,
    TGetQuaysSearchQueryVariables
>
