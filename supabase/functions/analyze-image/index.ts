import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { processImageAnalysis } from "./processImageAnalysis.ts";
import { extractSections } from "./extractSections.ts";

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
    const { image } = await req.json();
    if (!image) {
      throw new Error('No image data provided');
    }

    console.log('Processing image analysis request...');
    const base64Data = image.split(',')[1];
    
    if (!base64Data) {
      throw new Error('Invalid image data format');
    }

    // Process the image and get the analysis results
    console.log('Calling processImageAnalysis...');
    const analysisResults = await processImageAnalysis(base64Data);
    console.log('Analysis results received');

    // Extract sections from the analysis results
    console.log('Extracting sections...');
    const sections = extractSections(analysisResults.text);
    console.log('Sections extracted successfully');

    return new Response(
      JSON.stringify(sections),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
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