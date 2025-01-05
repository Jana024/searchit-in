export interface SimilarItem {
  name: string;
  similarity: number;
  purchase_url?: string;
  price?: string;
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
  historical_context?: string[];
  technical_details?: string[];
  advantages?: string[];
  disadvantages?: string[];
  usage_applications?: string[];
  market_information?: string[];
  product_links?: string;
  similar_items?: SimilarItem[];
  maintenance_care?: string[];
  environmental_impact?: string[];
  safety_considerations?: string[];
  expert_tips?: string[];
  educational_resources?: EducationalResource[];
  confidence: number;
}