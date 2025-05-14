
export interface Collaborator {
  id?: string;
  name: string;
  matricula: string;
  email: string;
  sector?: string;
  phone?: string;
  created_at?: string;
  password_hash?: string; // Added this field to fix TypeScript errors
}
