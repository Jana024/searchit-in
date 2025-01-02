import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting image analysis...');
    
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    const { image } = await req.json();
    
    if (!image) {
      throw new Error('No image data provided');
    }

    console.log('Received image data, preparing API request...');

    const base64Data = image.split(',')[1];
    
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

Market Information:
- [Price range if applicable]
- [Target market]
- [Availability]

Similar Items:
- [Similar item 1] | [Estimated price] | [Link if available] | [90%]
- [Similar item 2] | [Estimated price] | [Link if available] | [85%]
- [Similar item 3] | [Estimated price] | [Link if available] | [80%]

Expert Tips:
- [Expert tip 1]
- [Expert tip 2]
- [Expert tip 3]

Be specific and detailed in your analysis.`;

    console.log('Making request to Gemini API...');

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash/generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GEMINI_API_KEY}`,
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: base64Data
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
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error response:', errorText);
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}\n${errorText}`);
    }

    const data = await response.json();
    console.log('Successfully received Gemini API response');

    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts) {
      throw new Error('Invalid response format from Gemini API');
    }

    const textResponse = data.candidates[0].content.parts[0].text;
    console.log('Raw API response:', textResponse);
    
    // Parse the response into structured data
    const sections = {
      name: extractSection(textResponse, "Name") || "Unknown Item",
      description: extractSection(textResponse, "Description") || "No description available",
      category: extractSection(textResponse, "Category"),
      historical_context: extractListSection(textResponse, "Historical Context"),
      technical_details: extractListSection(textResponse, "Technical Details"),
      advantages: extractListSection(textResponse, "Advantages"),
      disadvantages: extractListSection(textResponse, "Disadvantages"),
      usage_applications: extractListSection(textResponse, "Usage & Applications"),
      market_information: extractListSection(textResponse, "Market Information"),
      similar_items: extractSimilarItems(textResponse),
      expert_tips: extractListSection(textResponse, "Expert Tips"),
      confidence: 95,
    };

    console.log('Processed analysis results:', sections);

    return new Response(JSON.stringify(sections), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in analyze-image function:', error);
    return new Response(
      JSON.stringify({
        error: error.message,
        details: 'An error occurred while processing the image analysis request.',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function extractSection(text: string, sectionName: string): string {
  const regex = new RegExp(`${sectionName}:\\s*(.+?)(?=\\n\\n|\\n[A-Za-z]+:|$)`, 's');
  const match = text.match(regex);
  return match ? match[1].trim() : "";
}

function extractListSection(text: string, sectionName: string): string[] {
  const section = text.match(new RegExp(`${sectionName}:([\\s\\S]*?)(?=\\n\\n[A-Za-z]+:|$)`));
  if (!section) return [];
  
  return section[1]
    .trim()
    .split('\n')
    .filter(line => line.trim().startsWith('-'))
    .map(item => item.substring(1).trim());
}

function extractSimilarItems(text: string): any[] {
  const similarSection = text.match(/Similar Items:([\s\S]*?)(?=\n\n[A-Za-z]+:|$)/);
  if (!similarSection) return [];

  return similarSection[1]
    .trim()
    .split('\n')
    .filter(line => line.trim().startsWith('-'))
    .map(item => {
      const parts = item.substring(1).split('|').map(s => s.trim());
      return {
        name: parts[0] || '',
        price: parts[1] || '',
        purchase_url: parts[2] || '',
        similarity: parseInt(parts[3]) || 85,
      };
    });
}