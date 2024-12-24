import * as Sentry from "@sentry/nuxt";

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.STAGE,
    sampleRate: 0.5,
  });
}
