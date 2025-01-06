import { AnalysisResult } from "./types.ts";

export async function processImageAnalysis(imageData: string): Promise<{ text: string }> {
  try {
    console.log('Starting image analysis process...');

    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    // The correct endpoint for Gemini Pro Vision API
    const endpoint = 'https://generativelanguage.googleapis.com/v1/models/gemini-pro-vision:generateContent';
    
    console.log('Making request to Gemini API...');
    const response = await fetch(
      `${endpoint}?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [
              {
                text: "Analyze this image in detail. Include these sections: Name, Description, Category, Historical Context, Technical Details, Advantages, Disadvantages, Usage & Applications, Expert Tips. Format each section with its name followed by a colon."
              },
              {
                inlineData: {
                  mimeType: "image/jpeg",
                  data: imageData
                }
              }
            ]
          }],
          generationConfig: {
            temperature: 0.4,
            topK: 32,
            topP: 1,
            maxOutputTokens: 4096,
          },
        })
      }
    );

    console.log('API Response status:', response.status);

    if (!response.ok) {
      const errorData = await response.text();
      console.error('API Error response:', errorData);
      throw new Error(`API request failed with status ${response.status}: ${errorData}`);
    }

    const data = await response.json();
    console.log('Received API response data structure:', Object.keys(data));

    // Extract the text from the Gemini API response with proper error handling
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      console.error('Invalid API response structure:', JSON.stringify(data, null, 2));
      throw new Error('No analysis text received from API');
    }

    console.log('Successfully extracted text from API response');
    return { text };

  } catch (error) {
    console.error('Error in processImageAnalysis:', error);
    throw error;
  }
}