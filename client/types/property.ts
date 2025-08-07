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
