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
    
    // Create a structured response with the desired format
    return {
      name: "Character Analysis",
      sections: [
        {
          title: "Name",
          content: extractSection(cleanedText, "name") || "Unknown Character"
        },
        {
          title: "Description",
          content: extractSection(cleanedText, "description") || "No description available"
        },
        {
          title: "Details",
          content: extractSection(cleanedText, "details") || "No details available"
        },
        {
          title: "Product Links",
          content: extractSection(cleanedText, "product_links") || "No product links available"
        },
        {
          title: "Website",
          content: extractSection(cleanedText, "website") || "No website information available"
        },
        {
          title: "Other Features",
          content: extractSection(cleanedText, "other_features") || "No additional features listed"
        }
      ],
      confidence: 95
    };
  } catch (error) {
    console.error("Error cleaning response:", error);
    throw new Error("Failed to parse analysis results");
  }
}

function extractSection(text: string, sectionName: string): string {
  try {
    const regex = new RegExp(`${sectionName}[:\\s]+(.*?)(?=\\n\\n|$)`, 'i');
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
            { 
              text: `Analyze this image and provide information in the following format:
                     Name: [Character or object name]
                     Description: [Brief overview]
                     Details: [Specific details about appearance and environment]
                     Product Links: [Related merchandise or items]
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