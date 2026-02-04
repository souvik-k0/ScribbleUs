const AIService = {
    // Model configuration
    MODEL: 'gemini-2.5-flash',
    API_URL: 'https://generativelanguage.googleapis.com/v1beta/models/',

    /**
     * Helper to get the API key from the store
     */
    getApiKey() {
        return Store.state.apiKey;
    },

    /**
     * Generic generate content method
     */
    async generateContent(prompt) {
        const apiKey = this.getApiKey();
        if (!apiKey) {
            throw new Error('API Key is missing. Please set it in the settings.');
        }

        const url = `${this.API_URL}${this.MODEL}:generateContent?key=${apiKey}`;
        
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: prompt }]
                    }]
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || `API Error: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.candidates && data.candidates.length > 0 && data.candidates[0].content) {
                return data.candidates[0].content.parts[0].text;
            } else {
                throw new Error('No content generated');
            }
        } catch (error) {
            console.error('AI Generation Error:', error);
            throw error;
        }
    },

    /**
     * Generate Love Letter
     */
    async generateLoveLetter(recipient, style, tone) {
        const prompt = `Write a ${style} love letter to ${recipient} with a ${tone} tone. Keep it under 200 words. Make it heartfelt and personal.`;
        return this.generateContent(prompt);
    },

    /**
     * Generate Card Message
     */
    async generateCardMessage(recipient, category, customContext) {
        let prompt = `Write a short, touching message for a ${category} card for ${recipient}. Keep it under 50 words.`;
        if (customContext) {
            prompt += ` Include this context: ${customContext}.`;
        }
        return this.generateContent(prompt);
    },

    /**
     * Analyze Artwork (Generate Caption)
     */
    async analyzeArtwork(styleName) {
        // Since we can't easily send the image in this setup without base64 handling which might be heavy,
        // we'll ask for a poetic description based on the style.
        const prompt = `Write a short, artistic, and poetic caption (2 sentences max) for a memory that has been transformed into a "${styleName}" style painting. Focus on the feelings of nostalgia and beauty.`;
        return this.generateContent(prompt);
    }
};
