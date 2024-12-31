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
    const name = extractSection(text, "Name") || "Unknown Item";
    const description = extractSection(text, "Description") || "No description available";
    const details = extractSection(text, "Details");
    const product_links = extractSection(text, "Product links");
    const website = extractSection(text, "Website");
    const other_features = extractSection(text, "Other Features");

    // Create a structured response
    return {
      name,
      description,
      details,
      product_links,
      website,
      other_features,
      confidence: 95,
      similar_items: [
        {
          name: "Similar item 1",
          similarity: 90,
          purchase_url: "https://example.com/item1",
          price: "$19.99"
        },
        {
          name: "Similar item 2",
          similarity: 85,
          purchase_url: "https://example.com/item2",
          price: "$24.99"
        }
      ]
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
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { image } = await req.json()
    const base64Image = image.replace(/^data:image\/\w+;base64,/, '')

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GEMINI_API_KEY}`,
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
    })

    const data = await response.json()
    
    if (!response.ok) {
      console.error('Gemini API error:', data)
      throw new Error(data.error?.message || 'Failed to analyze image')
    }

    const textResponse = data.candidates[0].content.parts[0].text
    const cleanedResponse = cleanResponse(textResponse)
    console.log("Cleaned response:", cleanedResponse)

    return new Response(
      JSON.stringify(cleanedResponse),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})