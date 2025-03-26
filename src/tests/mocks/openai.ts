export const mockOpenAI = {
    chat: {
        completions: {
            create: jest.fn().mockResolvedValue({
                choices: [{
                    message: {
                        content: JSON.stringify({
                            sentiment: { mood: 'positive', score: 0.8 },
                            themes: ['happiness', 'success'],
                            topics: ['personal', 'achievement']
                        })
                    }
                }]
            })
        }
    }
};