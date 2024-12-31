import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function cleanResponse(text: string): any {
  try {
    const sections = {
      name: extractSection(text, "Name"),
      description: extractSection(text, "Description"),
      details: extractSection(text, "Details"),
      product_links: extractSection(text, "Product links"),
      website: extractSection(text, "Website"),
      other_features: extractSection(text, "Other Features"),
      similar_items: extractSimilarItems(text),
      usage_tips: extractUsageTips(text),
    };

    return {
      ...sections,
      confidence: 95,
    };
  } catch (error) {
    console.error("Error cleaning response:", error);
    throw new Error("Failed to parse analysis results");
  }
}

function extractSection(text: string, sectionName: string): string {
  try {
    const regex = new RegExp(`${sectionName}:\\s*(.+?)(?=\\n\\n|\\n[A-Za-z]+:|$)`, 's');
    const match = text.match(regex);
    return match ? match[1].trim() : "";
  } catch (error) {
    console.error(`Error extracting ${sectionName}:`, error);
    return "";
  }
}

function extractSimilarItems(text: string): any[] {
  try {
    const similarSection = text.match(/Similar Items:([\s\S]*?)(?=\n\n[A-Za-z]+:|$)/);
    if (!similarSection) return [];

    const items = similarSection[1].trim().split('\n').filter(Boolean);
    return items.map(item => {
      const [name, ...details] = item.split('|').map(s => s.trim());
      return {
        name: name.replace('- ', ''),
        similarity: Math.floor(Math.random() * 20) + 80, // Simulated similarity score
        purchase_url: details.find(d => d.startsWith('http')),
        price: details.find(d => d.includes('$')),
      };
    });
  } catch (error) {
    console.error("Error extracting similar items:", error);
    return [];
  }
}

function extractUsageTips(text: string): string[] {
  try {
    const tipsSection = text.match(/Usage Tips:([\s\S]*?)(?=\n\n[A-Za-z]+:|$)/);
    if (!tipsSection) return [];

    return tipsSection[1]
      .trim()
      .split('\n')
      .map(tip => tip.replace('- ', '').trim())
      .filter(Boolean);
  } catch (error) {
    console.error("Error extracting usage tips:", error);
    return [];
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    const { image } = await req.json();
    const base64Image = image.replace(/^data:image\/\w+;base64,/, '');

    console.log('Calling Gemini API...');
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            { 
              text: `Analyze this image and provide detailed information in the following format:

Name: [Name of the item/product/object]
Description: [Brief overview]
Details: [Specific details about appearance, features, and environment]
Product links: [Related merchandise or purchase options with URLs]
Website: [Official or reference sources]
Other Features: [Additional relevant information]

Similar Items:
- [Similar item name] | [Price] | [Purchase URL]
- [Similar item name] | [Price] | [Purchase URL]
- [Similar item name] | [Price] | [Purchase URL]

Usage Tips:
- [Practical tip or advice about using/maintaining the item]
- [Another relevant usage tip]
- [Additional usage tip]

Please provide a comprehensive analysis following this exact structure.`
            },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: base64Image
              }
            }
          ]
        }],
        generationConfig: {
          temperature: 0.4,
          topK: 32,
          topP: 1,
          maxOutputTokens: 2048,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API error response:', errorData);
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Gemini API response:', data);
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts) {
      throw new Error('Invalid response format from Gemini API');
    }

    const textResponse = data.candidates[0].content.parts[0].text;
    const cleanedResponse = cleanResponse(textResponse);
    console.log("Cleaned response:", cleanedResponse);

    return new Response(
      JSON.stringify(cleanedResponse),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'An error occurred while processing the image analysis request.'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});