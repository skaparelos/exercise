import { User } from "@/types/users";

export interface Team {
  id: number;
  name: string;
  department?: string | null;
  parent_id: number | null;
  created_at?: Date;
  metadata: Record<string, any>;
  members?: TeamMember[];
  children?: Team[];
  full_path?: string;
}

export interface TeamMember extends User {
  role: TeamRole;
  is_active: boolean;
}

export type TeamRole = 'ADMIN' | 'MEMBER';


