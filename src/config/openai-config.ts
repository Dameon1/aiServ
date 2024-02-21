import Configuration from 'openai'

export function configureOpenAI() {
    const config = new Configuration({
        apiKey: process.env.OPENAI_API_SECRET,
        organization: process.env.OPEN_AI_ORG
    })
    return config;
}