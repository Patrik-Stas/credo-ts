import { fileURLToPath } from 'node:url'
import { dirname as pathDirname } from 'node:path'
import type { DrizzleRecordBundle } from './DrizzleRecord'

// Make dirname work even when import.meta.dirname is not provided by the loader
const __filename = fileURLToPath(import.meta.url)
export const dirname =
  typeof import.meta.dirname === 'string' && import.meta.dirname.length > 0
    ? import.meta.dirname
    : pathDirname(__filename)
export const rootDirectory = `${dirname}/..`

const addSchemaExtension = (path: string) => (dirname.endsWith('/src') ? `${path}.ts` : `${path}.mjs`)

export const bundleMigrationDefinition = (bundle: string): DrizzleRecordBundle['migrations'] => ({
  postgres: {
    schemaPath: addSchemaExtension(`${dirname}/${bundle}/postgres`),
    migrationsPath: `${rootDirectory}/migrations/${bundle}/postgres`,
  },
  sqlite: {
    schemaPath: addSchemaExtension(`${dirname}/${bundle}/sqlite`),
    migrationsPath: `${rootDirectory}/migrations/${bundle}/sqlite`,
  },
})

// NOTE: due to us using legacy decorators it's not really possible
// to import the credo modules, since it causes parser errors
// the exhaustive array method does type-checking (not runtime checking)
// that all the enum values are present
export function exhaustiveArray<U extends string, T extends readonly string[]>(
  _type: U,
  arr: T &
    (T[number] extends `${U}`
      ? `${U}` extends T[number]
        ? T
        : `Expected array to contain '${U}'`
      : `Expect array to contain '${U}'`)
): T {
  return arr
}
