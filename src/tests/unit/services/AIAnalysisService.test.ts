import { AIAnalysisService } from '../../../services/AIAnalysisService';
import { mockOpenAI } from '../../mocks/openai';

jest.mock('openai', () => mockOpenAI);

describe('AIAnalysisService', () => {
    describe('analyzeEntry', () => {
        it('should analyze journal entry content', async () => {
            const content = "Today was a great day!";
            const analysis = await AIAnalysisService.analyzeEntry(content);
            
            expect(analysis).toHaveProperty('sentiment');
            expect(analysis).toHaveProperty('themes');
            expect(analysis.sentiment.mood).toBe('positive');
        });

        it('should handle errors gracefully', async () => {
            const content = "";
            await expect(AIAnalysisService.analyzeEntry(content))
                .rejects
                .toThrow();
        });
    });
});