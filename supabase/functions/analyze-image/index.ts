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
    // Remove any JSON formatting characters that might be in the text
    const cleanedText = text.replace(/```json|```|\\/g, '').trim();
    // Parse the cleaned text into an object
    const parsedResponse = JSON.parse(cleanedText);
    
    // Ensure all required fields are present and properly formatted
    return {
      name: parsedResponse.name || "Unknown Object",
      description: parsedResponse.description || "No description available",
      confidence: Number(parsedResponse.confidence) || 0,
      similar_items: Array.isArray(parsedResponse.similar_items) 
        ? parsedResponse.similar_items.map((item: any) => ({
            name: item.name || "Similar Item",
            similarity: Number(item.similarity) || 0,
            purchase_url: item.purchase_url || undefined,
            price: item.price || undefined
          }))
        : [],
      category: parsedResponse.category || undefined,
      usage_tips: Array.isArray(parsedResponse.usage_tips) 
        ? parsedResponse.usage_tips 
        : []
    };
  } catch (error) {
    console.error("Error cleaning response:", error);
    throw new Error("Failed to parse analysis results");
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { image } = await req.json()

    // Remove the data:image/jpeg;base64, prefix if present
    const base64Image = image.replace(/^data:image\/\w+;base64,/, '')

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: "Analyze this image and provide detailed information in a structured format. Include: 1) The main object or subject name, 2) A detailed description, 3) A confidence score (0-100), and 4) Three similar items or related objects. Format the response as a JSON object with 'name' (string), 'description' (string), 'confidence' (number), and 'similar_items' (array of objects with 'name' and 'similarity' score)." },
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

    // Clean and format the response
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