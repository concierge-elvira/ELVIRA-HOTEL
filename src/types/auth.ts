// Type definitions for the application

export type UserRole = "elvira" | "hotel";

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export interface AuthState {
  user: UserProfile | null;
  loading: boolean;
}

export interface Module {
  id: string;
  name: string;
  description: string;
  path: string;
  icon: string;
}
