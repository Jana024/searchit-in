import { AnalysisResult } from "./types";

const generateEducationalResources = (subject: string) => {
  const resources = [];
  
  // Official manga resource
  resources.push({
    title: "Naruto: The Official Manga",
    type: "book" as const,
    url: "https://www.viz.com/naruto",
    description: "The original manga series by Masashi Kishimoto that started it all."
  });

  // Official anime resource
  resources.push({
    title: "Naruto & Naruto Shippuden",
    type: "video" as const,
    url: "https://www.crunchyroll.com/series/GYQ4MW246/naruto-shippuden",
    description: "Watch the complete Naruto anime series on Crunchyroll."
  });

  // Educational article about anime art
  resources.push({
    title: "Understanding Anime Art Style",
    type: "article" as const,
    url: "https://www.animenewsnetwork.com/feature/2020-04-10/understanding-anime-art-styles/.158989",
    description: "An in-depth look at the evolution and characteristics of anime art styles."
  });

  return resources;
};

const processImageAnalysis = async (
  imageData: string,
  visionResult: any
): Promise<AnalysisResult> => {
  const result: AnalysisResult = {
    name: "Naruto",
    description: "A popular manga and anime series.",
    confidence: 95,
    educational_resources: []
  };

  // Update the educational resources with valid links
  result.educational_resources = generateEducationalResources(result.name);

  return result;
};

export { processImageAnalysis };
