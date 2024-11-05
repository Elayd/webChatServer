import * as Sentry from '@sentry/node'
import { nodeProfilingIntegration } from '@sentry/profiling-node'

Sentry.init({
    dsn: 'https://4297915770dc2251d3bf3b506b1fa4b7@o4508230447529984.ingest.de.sentry.io/4508246989144144',
    integrations: [nodeProfilingIntegration()],
    tracesSampleRate: 1.0,
    profilesSampleRate: 1.0
})
