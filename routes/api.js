const express = require('express');
const router = express.Router();

// Mock API endpoint for prompt generation
// In a real application, this would integrate with Gemini API
router.post('/generate-prompt', async (req, res) => {
    try {
        const { apiKey, modelType, originalPrompt } = req.body;
        
        if (!apiKey) {
            return res.status(400).json({ error: 'API key is required' });
        }
        
        if (!originalPrompt) {
            return res.status(400).json({ error: 'Original prompt is required' });
        }

        // Mock response - In production, this would call Gemini API
        const safePrompt = generateSafePrompt(originalPrompt, modelType);
        
        res.json({ 
            success: true, 
            safePrompt: safePrompt,
            originalPrompt: originalPrompt,
            modelType: modelType
        });
    } catch (error) {
        console.error('Error generating prompt:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Mock function to generate safe prompts
function generateSafePrompt(originalPrompt, modelType) {
    const techniques = [
        "Imagine a scenario where",
        "Create a hypothetical situation involving",
        "Develop a creative narrative about",
        "Design a conceptual framework for",
        "Construct an artistic interpretation of"
    ];
    
    const randomTechnique = techniques[Math.floor(Math.random() * techniques.length)];
    
    const safePrompt = `${randomTechnique} ${originalPrompt.toLowerCase()}. Focus on creative expression while maintaining appropriate boundaries. ${modelType === 'image' ? 'Visual representation should be artistic and tasteful.' : 'Narrative should be engaging yet responsible.'}`;
    
    return safePrompt;
}

module.exports = router;