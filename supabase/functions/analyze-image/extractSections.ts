import type { AnalysisResult } from "./types";

export function extractSections(text: string | undefined): Partial<AnalysisResult> {
  // Return default values if text is undefined
  if (!text) {
    console.log('Warning: No text provided to extractSections');
    return {
      name: "Unknown Item",
      description: "No description available",
      confidence: 0,
    };
  }

  return {
    name: extractSection(text, "Name") || "Unknown Item",
    description: extractSection(text, "Description") || "No description available",
    category: extractSection(text, "Category"),
    historical_context: extractListSection(text, "Historical Context"),
    technical_details: extractListSection(text, "Technical Details"),
    advantages: extractListSection(text, "Advantages"),
    disadvantages: extractListSection(text, "Disadvantages"),
    usage_applications: extractListSection(text, "Usage & Applications"),
    expert_tips: extractListSection(text, "Expert Tips"),
    educational_resources: extractEducationalResources(text),
    product_links: generateProductLinks(extractSection(text, "Name") || "Unknown Item"),
    confidence: 95,
  };
}

function extractSection(text: string, sectionName: string): string | null {
  try {
    const regex = new RegExp(`${sectionName}:\\s*(.+?)(?=\\n\\n|\\n[A-Za-z]+:|$)`, 's');
    const match = text.match(regex);
    return match ? match[1].trim() : null;
  } catch (error) {
    console.error(`Error extracting section ${sectionName}:`, error);
    return null;
  }
}

function extractListSection(text: string, sectionName: string): string[] {
  try {
    const section = text.match(new RegExp(`${sectionName}:([\\s\\S]*?)(?=\\n\\n[A-Za-z]+:|$)`));
    if (!section) return [];
    
    return section[1]
      .trim()
      .split('\n')
      .filter(line => line.trim().startsWith('-'))
      .map(item => item.substring(1).trim());
  } catch (error) {
    console.error(`Error extracting list section ${sectionName}:`, error);
    return [];
  }
}

function extractEducationalResources(text: string): any[] {
  try {
    const section = text.match(/Educational Resources:([\s\S]*?)(?=\n\n[A-Za-z]+:|$)/);
    if (!section) return generateDefaultEducationalResources();

    const resources = section[1]
      .trim()
      .split('\n')
      .filter(line => line.trim().startsWith('-'))
      .map(item => {
        const parts = item.substring(1).split('|').map(s => s.trim());
        return {
          title: parts[0] || '',
          type: (parts[1] || 'article').replace('Type: ', ''),
          url: (parts[2] || '').replace('URL: ', ''),
          description: parts[3] || '',
        };
      });

    return resources.length > 0 ? resources : generateDefaultEducationalResources();
  } catch (error) {
    console.error('Error extracting educational resources:', error);
    return generateDefaultEducationalResources();
  }
}

function generateProductLinks(objectName: string): string[] {
  const encodedName = encodeURIComponent(objectName);
  return [
    `https://www.amazon.com/s?k=${encodedName}`,
    `https://www.ebay.com/sch/i.html?_nkw=${encodedName}`,
    `https://www.walmart.com/search?q=${encodedName}`,
    `https://www.google.com/search?q=${encodedName}+reviews`,
    `https://www.youtube.com/results?search_query=${encodedName}+review`
  ];
}

function generateDefaultEducationalResources() {
  return [
    {
      title: "General Information",
      type: "article",
      url: "https://www.wikipedia.org",
      description: "Find general information about this type of item"
    },
    {
      title: "Online Courses",
      type: "course",
      url: "https://www.coursera.org",
      description: "Learn more about similar items and their applications"
    },
    {
      title: "Video Tutorials",
      type: "video",
      url: "https://www.youtube.com",
      description: "Watch video tutorials and reviews"
    }
  ];
}