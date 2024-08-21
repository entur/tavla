import { useNonNullContext } from 'hooks/useNonNullContext'
import { createContext } from 'react'
import { TTag } from 'types/meta'

export const TagsContext = createContext<TTag[] | undefined>(undefined)

export const useTags = () => useNonNullContext(TagsContext)
