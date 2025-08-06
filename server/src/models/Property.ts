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
  mainImage?: string | null;
  images?: string[] | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface ScrapedPropertyData {
  providerName: string;
  address: string;
  city: string;
  county: string;
  zipcode: string;
}
