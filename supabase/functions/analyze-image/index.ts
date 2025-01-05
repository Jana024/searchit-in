import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { processImageAnalysis } from "./processImageAnalysis.ts";
import { extractSections } from "./extractSections.ts";
import { getLocationSuggestions } from "./getLocationSuggestions.ts";

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    const { image } = await req.json();
    if (!image) {
      throw new Error('No image data provided');
    }

    const base64Data = image.split(',')[1];
    const analysisResults = await processImageAnalysis(base64Data, GEMINI_API_KEY);
    const locationSuggestions = await getLocationSuggestions(analysisResults);
    const sections = extractSections(analysisResults.text);

    return new Response(
      JSON.stringify({ ...sections, location_suggestions: locationSuggestions }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

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