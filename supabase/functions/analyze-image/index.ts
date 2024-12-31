import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"

function cleanResponse(text: string): any {
  try {
    // Extract sections from the text response
    const sections = {
      name: extractSection(text, "Name"),
      description: extractSection(text, "Description"),
      details: extractSection(text, "Details"),
      product_links: extractSection(text, "Product links"),
      website: extractSection(text, "Website"),
      other_features: extractSection(text, "Other Features"),
    };

    // Create a structured response
    return {
      name: sections.name || "Unknown Item",
      description: sections.description || "No description available",
      details: sections.details || "No details available",
      product_links: sections.product_links || "No product links available",
      website: sections.website || "No website available",
      other_features: sections.other_features || "No additional features available",
      confidence: 95
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

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    const { image } = await req.json()
    const base64Image = image.replace(/^data:image\/\w+;base64,/, '')

    console.log('Calling Gemini API...');
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            { 
              text: `Analyze this image and provide information in the following format:
                     Name: [Name of the item/character/object]
                     Description: [Brief overview]
                     Details: [Specific details about appearance and environment]
                     Product links: [Related merchandise or items]
                     Website: [Official or reference sources]
                     Other Features: [Additional relevant information]
                     
                     Please provide a detailed analysis following this exact structure.`
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