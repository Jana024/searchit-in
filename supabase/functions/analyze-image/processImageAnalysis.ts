import { AnalysisResult } from "./types.ts";

const generateProductLinks = (objectName: string) => {
  // Add popular e-commerce and reference sites
  return [
    `https://www.amazon.com/s?k=${encodeURIComponent(objectName)}`,
    `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(objectName)}`,
    `https://www.walmart.com/search?q=${encodeURIComponent(objectName)}`
  ];
};

const generateEducationalResources = (subject: string) => {
  const resources = [
    {
      title: `${subject} on Wikipedia`,
      type: "article" as const,
      url: `https://en.wikipedia.org/wiki/${encodeURIComponent(subject)}`,
      description: `Comprehensive information about ${subject}`
    },
    {
      title: `${subject} Learning Resources`,
      type: "course" as const,
      url: `https://www.coursera.org/search?query=${encodeURIComponent(subject)}`,
      description: `Online courses related to ${subject}`
    },
    {
      title: `${subject} Research Articles`,
      type: "article" as const,
      url: `https://scholar.google.com/scholar?q=${encodeURIComponent(subject)}`,
      description: `Academic research and papers about ${subject}`
    },
    {
      title: `${subject} Video Tutorials`,
      type: "video" as const,
      url: `https://www.youtube.com/results?search_query=${encodeURIComponent(subject)}+tutorial`,
      description: `Video tutorials and explanations about ${subject}`
    }
  ];

  return resources;
};

const processImageAnalysis = async (
  imageData: string,
  visionResult: any
): Promise<AnalysisResult> => {
  console.log('Processing image analysis with vision result:', visionResult);

  // For demonstration, using a sample object name
  // In production, this would come from the vision API result
  const objectName = "Sample Object";

  const result: AnalysisResult = {
    name: objectName,
    description: "A detailed description of the detected object",
    category: "General",
    confidence: 95,
    product_links: generateProductLinks(objectName),
    educational_resources: generateEducationalResources(objectName)
  };

  console.log('Generated analysis result:', result);
  return result;
};

export { processImageAnalysis };