export async function processImageAnalysis(base64Data: string, apiKey: string) {
  const prompt = `Analyze this image in detail and provide comprehensive information about what you see. Format your response exactly like this, maintaining the exact structure:

Name: [Product/item name]
Description: [2-3 sentences describing what you see]
Category: [Main category]

Historical Context:
- [Key historical point 1]
- [Key historical point 2]
- [Key historical point 3]

Technical Details:
- [Specification 1]
- [Specification 2]
- [Specification 3]

Advantages:
- [Advantage 1]
- [Advantage 2]
- [Advantage 3]

Disadvantages:
- [Disadvantage 1]
- [Disadvantage 2]
- [Disadvantage 3]

Usage & Applications:
- [Usage 1]
- [Usage 2]
- [Usage 3]

Expert Tips:
- [Expert tip 1]
- [Expert tip 2]
- [Expert tip 3]

Educational Resources:
- [Resource Title] | [Type: article/book/video/course] | [URL] | [Brief description]
- [Resource Title] | [Type: article/book/video/course] | [URL] | [Brief description]
- [Resource Title] | [Type: article/book/video/course] | [URL] | [Brief description]

Be specific and detailed in your analysis.`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            { inline_data: { mime_type: "image/jpeg", data: base64Data } }
          ]
        }],
        generationConfig: {
          temperature: 0.4,
          topK: 32,
          topP: 1,
          maxOutputTokens: 4096,
        },
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error: ${response.status} ${response.statusText}\n${errorText}`);
  }

  const data = await response.json();
  if (!data.candidates?.[0]?.content?.parts?.[0]) {
    throw new Error('Invalid response format from Gemini API');
  }

  return data.candidates[0].content.parts[0];
}