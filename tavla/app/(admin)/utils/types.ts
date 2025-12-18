import { FolderDB } from 'types/db-types/folders'

/**
 * Represents a folder with additional metadata.
 *
 * Extends the `FolderDB` type by including the number of boards contained in the folder
 * and the timestamp of the last update.
 *
 * @property {number} boardCount - The number of boards in the folder.
 * @property {number} [lastUpdated] - The timestamp (in milliseconds since epoch) when the folder was last updated. Optional.
 */
export type Folder = FolderDB & {
    boardCount: number
    lastUpdated?: number
}
