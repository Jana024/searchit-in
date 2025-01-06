export interface SimilarItem {
  name: string;
  similarity: number;
  purchase_url?: string;
  price?: string;
  features?: string[];
  uses?: string[];
  availability?: {
    online?: boolean;
    stores?: string[];
    regions?: string[];
  };
  comparison_score?: number;
}

export interface LocationSuggestion {
  name: string;
  type: 'landmark' | 'plant' | 'animal';
  distance: string;
  description: string;
  confidence: number;
}

export interface EducationalResource {
  title: string;
  type: 'article' | 'book' | 'video' | 'course';
  url: string;
  description: string;
}

export interface AnalysisResult {
  name: string;
  description: string;
  category?: string;
  extracted_text?: string;
  historical_context?: string[];
  technical_details?: string[];
  advantages?: string[];
  disadvantages?: string[];
  usage_applications?: string[];
  market_information?: string[];
  product_links?: string[];
  similar_items?: SimilarItem[];
  maintenance_care?: string[];
  environmental_impact?: string[];
  safety_considerations?: string[];
  expert_tips?: string[];
  educational_resources?: EducationalResource[];
  location_suggestions?: LocationSuggestion[];
  confidence: number;
}