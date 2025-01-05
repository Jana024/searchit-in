import type { AnalysisResult } from "../../../src/components/results/types.ts";

export function extractSections(text: string): Partial<AnalysisResult> {
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
    confidence: 95,
  };
}

function extractSection(text: string, sectionName: string): string {
  const regex = new RegExp(`${sectionName}:\\s*(.+?)(?=\\n\\n|\\n[A-Za-z]+:|$)`, 's');
  const match = text.match(regex);
  return match ? match[1].trim() : "";
}

function extractListSection(text: string, sectionName: string): string[] {
  const section = text.match(new RegExp(`${sectionName}:([\\s\\S]*?)(?=\\n\\n[A-Za-z]+:|$)`));
  if (!section) return [];
  
  return section[1]
    .trim()
    .split('\n')
    .filter(line => line.trim().startsWith('-'))
    .map(item => item.substring(1).trim());
}

function extractEducationalResources(text: string): any[] {
  const section = text.match(/Educational Resources:([\s\S]*?)(?=\n\n[A-Za-z]+:|$)/);
  if (!section) return [];

  return section[1]
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
}