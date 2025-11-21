export interface Lead {
  id: string;
  name: string;
  address: string;
  phone: string;
  website: string;
  rating: string;
  city: string;
}

export enum SearchMode {
  SINGLE = 'SINGLE',
  MULTI = 'MULTI'
}

export interface SearchParams {
  segment: string;
  mode: SearchMode;
  singleCity: string;
  multiCities: string; // Raw text input for multi-cities
}

export interface SearchResult {
  leads: Lead[];
  city: string;
  status: 'loading' | 'success' | 'error';
  error?: string;
}