import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-pro-vision:generateContent"

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
            { text: "Analyze this image and provide detailed information about what you see. Include the main object or subject, its characteristics, and any relevant details. Format the response as a JSON object with 'name' (string), 'description' (string), and 'confidence' (number between 0-100)." },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: base64Image
              }
            }
          ]
        }]
      })
    })

    const data = await response.json()
    
    if (!response.ok) {
      console.error('Gemini API error:', data)
      throw new Error(data.error?.message || 'Failed to analyze image')
    }

    // Parse the response text as JSON
    const textResponse = data.candidates[0].content.parts[0].text
    let parsedResponse
    try {
      parsedResponse = JSON.parse(textResponse)
    } catch (e) {
      // If parsing fails, create a structured response from the text
      parsedResponse = {
        name: "Analysis Result",
        description: textResponse,
        confidence: 90
      }
    }

    return new Response(
      JSON.stringify(parsedResponse),
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