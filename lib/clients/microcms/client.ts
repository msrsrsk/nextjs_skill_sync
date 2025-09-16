import { createClient } from "microcms-js-sdk"

if (!process.env.MICROCMS_LOGS_ENDPOINT || !process.env.MICROCMS_LOGS_API_KEY) {
    throw new Error('Required environment variables of microCMS are not set');
}

export const client = createClient({
    serviceDomain: process.env.MICROCMS_LOGS_ENDPOINT!,
    apiKey: process.env.MICROCMS_LOGS_API_KEY!,
});