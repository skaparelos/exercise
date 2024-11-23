export interface Team {
  id: string;
  name: string;
  department: string | null;
  parent_id: string | null;
  created_at: Date;
  metadata: Record<string, any>;
  team_members?: TeamMember[];
}

export type TeamRole = 'ADMIN' | 'MEMBER';

export interface TeamMember {
  member_id: string;
  team_id: string;
  role: TeamRole;
  is_active: boolean;
  created_at: Date;
} 