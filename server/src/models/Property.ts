export interface Property {
  id?: number;
  name: string;
  address?: string | null;
  city?: string | null;
  county?: string | null;
  zipcode?: string | null;
  state?: string | null;
  phone?: string | null;
  type?: string | null;
  capacity?: number | null;
  images?: string[] | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface CreatePropertyRequest {
  name: string;
  address?: string;
  city?: string;
  state?: string;
  zipcode?: string;
  county?: string;
  phone?: string;
  type?: string;
  capacity?: number;
}

export interface UpdatePropertyRequest {
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  zipcode?: string;
  county?: string;
  phone?: string;
  type?: string;
  capacity?: number;
}

export interface PropertyResponse {
  success: boolean;
  data: Property;
  message?: string;
}

export interface PropertiesResponse {
  success: boolean;
  data: Property[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ScrapedPropertyData {
  providerName: string;
  address: string;
  city: string;
  county: string;
  zipcode: string;
}

export interface ScrapeResponse {
  success: boolean;
  data: {
    provider: ScrapedPropertyData;
    searchedProperty: string;
    availableProperties: string[];
  };
  message?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
