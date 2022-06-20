/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */

const { readFileSync } = require('fs')
const { join } = require('path')

const { SecretManagerServiceClient } = require('@google-cloud/secret-manager')

const { parse: parseDotEnv } = require('dotenv')

const client = new SecretManagerServiceClient()

function parse(dotenvPath) {
    try {
        const parsed = parseDotEnv(
            readFileSync(dotenvPath, { encoding: 'utf8' }),
        )
        return Object.entries(parsed).reduce((obj, [key, value]) => {
            // eslint-disable-next-line no-param-reassign
            obj[key] = value
            return obj
        }, {})
    } catch (e) {
        return {}
    }
}
async function getSecret(key, environment) {
    const secretsPath = `projects/entur-tavla-${environment}/secrets/${key}/versions/latest`
    let version
    try {
        const [secretVersion] = await client.accessSecretVersion({
            name: secretsPath,
        })

        version = secretVersion

        console.log('cersion ', version)
    } catch (err) {
        console.error(err)
        // If you get this when running locally, check that you have authenticated with gcloud,
        // for example using 'gcloud auth application-default login'
        throw Error(
            `Could not get secret from "${secretsPath}", perhaps the path is wrong?`,
        )
    }

    const payload = version?.payload?.data?.toString()
    if (!payload) {
        throw Error(
            `Secret "${key}" is undefined, check what is stored in Google Secrets at "${secretsPath}"`,
        )
    }

    console.log(`Got secret "${key}" from Google Secret Manager`)
    return payload || ''
}

/**
 * Takes an object and replaces values matching the pattern
 * '{{secrets.MY_SECRET_NAME}}' with the actual secret value from
 * Google Secret Manager.
 */
async function populateSecretVars(vars, environment) {
    const populatedEntries = await Promise.all(
        Object.entries(vars).map(async (entry) => {
            const [key, value] = entry
            console.log(key, value)
            const secretName = value.match(/^\{\{secrets\.(.+)\}\}$/)?.[1]
            if (!secretName) {
                return entry
            }

            const secret = await getSecret(secretName, environment)

            return [key, secret]
        }),
    )

    return Object.fromEntries(populatedEntries)
}

async function populate(env = 'staging', version) {
    console.log(`Loading environment configuration for ${env}\n`)
    const localVars = parse(join(process.cwd(), '.env.local'))
    const environmentVars = parse(join(__dirname, `./.env.${env}`))

    const vars = await populateSecretVars(
        {
            ...environmentVars,
            ...localVars,
            ENVIRONMENT: env,
            VERSION: process.env.VERSION || version,
        },
        env,
    )

    Object.assign(process.env, vars)
    return vars
}

module.exports = populate
