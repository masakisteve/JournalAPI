import OpenAI from 'openai';
import logger from '../utils/logger';

export class AIAnalysisService {
    private static openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    });

    static async analyzeEntry(content: string) {
        try {
            const response = await this.openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "You are an AI journal analyst. Analyze the following journal entry and provide: 1) Sentiment/mood analysis 2) Main themes 3) Key topics 4) Writing style analysis. Respond in JSON format."
                    },
                    {
                        role: "user",
                        content: content
                    }
                ],
                temperature: 0.7,
                max_tokens: 500
            });

            return JSON.parse(response.choices[0].message.content || '{}');
        } catch (error) {
            logger.error('Error analyzing entry with AI', { error });
            throw error;
        }
    }

    static async suggestCategories(content: string): Promise<string[]> {
        try {
            const response = await this.openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "You are a journal categorization expert. Suggest 2-3 relevant categories for this journal entry. Respond with only an array of category names."
                    },
                    {
                        role: "user",
                        content: content
                    }
                ],
                temperature: 0.7,
                max_tokens: 100
            });

            return JSON.parse(response.choices[0].message.content || '[]');
        } catch (error) {
            logger.error('Error suggesting categories', { error });
            throw error;
        }
    }

    static async generateWritingPrompt(previousEntries: string[]): Promise<string> {
        try {
            const response = await this.openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "You are a thoughtful journal prompt generator. Based on the themes from previous entries, generate an insightful writing prompt."
                    },
                    {
                        role: "user",
                        content: `Previous entries themes: ${previousEntries.join('. ')}`
                    }
                ],
                temperature: 0.9,
                max_tokens: 100
            });

            return response.choices[0].message.content || '';
        } catch (error) {
            logger.error('Error generating writing prompt', { error });
            throw error;
        }
    }
}