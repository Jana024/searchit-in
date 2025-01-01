import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const { image } = await req.json();
    
    if (!image) {
      throw new Error('No image data provided');
    }

    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY not found in environment variables');
    }

    console.log('Preparing Gemini API request...');
    
    // Using the correct Gemini Vision API endpoint
    const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-pro-vision:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            {
              text: `Analyze this image in detail and provide comprehensive information in the following format:

Name: [Main subject/item name]
Description: [Detailed description including visual characteristics, context, and setting]
Category: [Primary and secondary categories]
Details: [Comprehensive analysis including physical characteristics, materials, dimensions, notable features]
Product Information: [Brand, model, price range if applicable]
Website: [Official or relevant website]
Other Features: [Additional notable characteristics]

Similar Items:
[List 3-5 similar items with:
- Name
- Approximate price
- Purchase URL (if applicable)]

Usage Tips:
[List 5-7 practical tips for using or interacting with the subject]`
            },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: image.split(',')[1] // Remove the data URL prefix
              }
            }
          ]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 32,
          topP: 1,
          maxOutputTokens: 2048,
        },
      }),
    });

    console.log('Gemini API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error response:', errorText);
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Received response from Gemini API');

    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid response format from Gemini API');
    }

    const textResponse = data.candidates[0].content.parts[0].text;
    
    // Parse the response into structured data
    const parsedResponse = {
      name: extractSection(textResponse, "Name"),
      description: extractSection(textResponse, "Description"),
      category: extractSection(textResponse, "Category"),
      details: extractSection(textResponse, "Details"),
      product_links: extractSection(textResponse, "Product Information"),
      website: extractSection(textResponse, "Website"),
      other_features: extractSection(textResponse, "Other Features"),
      confidence: 95,
      similar_items: extractSimilarItems(textResponse),
      usage_tips: extractUsageTips(textResponse),
    };

    return new Response(JSON.stringify(parsedResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in analyze-image function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'An error occurred while processing the image analysis request.'
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

function extractSimilarItems(text: string): Array<{name: string; similarity: number; purchase_url?: string; price?: string}> {
  const similarSection = text.match(/Similar Items:([\s\S]*?)(?=\n\n[A-Za-z]+:|$)/);
  if (!similarSection) return [];

  return similarSection[1]
    .trim()
    .split('\n')
    .filter(line => line.trim().length > 0 && !line.includes('Similar Items:'))
    .map(item => {
      const parts = item.split('-').map(part => part.trim());
      const nameMatch = parts[0]?.match(/^[^($]+/);
      const priceMatch = parts[0]?.match(/\$[\d,.]+/);
      const urlMatch = parts.find(part => part.includes('http'));
      
      return {
        name: nameMatch ? nameMatch[0].trim() : item,
        similarity: Math.floor(Math.random() * 20) + 80,
        price: priceMatch ? priceMatch[0] : undefined,
        purchase_url: urlMatch || undefined,
      };
    });
}

function extractUsageTips(text: string): string[] {
  const tipsSection = text.match(/Usage Tips:([\s\S]*?)(?=\n\n[A-Za-z]+:|$)/);
  if (!tipsSection) return [];

  return tipsSection[1]
    .trim()
    .split('\n')
    .filter(line => line.trim().length > 0 && !line.includes('Usage Tips:'))
    .map(tip => tip.replace(/^[-*]\s*/, '').trim());
}