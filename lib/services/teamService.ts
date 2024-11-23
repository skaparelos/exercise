import pool from '@/lib/db';
import {
  getTeamsQuery,
  getTeamsWithMembersQuery,
} from '@/lib/queries/teams';
import { Team } from '@/types/teams';


export async function getAllTeams(): Promise<Team[]> {
  try {
    const { rows } = await pool.query(getTeamsQuery);
    return rows;
  } catch (error) {
    console.error('Error fetching teams:', error);
    throw new Error('Failed to fetch teams');
  }
}

export async function getTeamsWithMembers(): Promise<Team[]> {
  try {
    const res = await pool.query(getTeamsWithMembersQuery);
    const rows = res.rows;

    // Process the rows to build teams and their members
    const teamsById: { [key: number]: Team } = {};
    const teamsArray: Team[] = [];

    for (const row of rows) {
      let team = teamsById[row.team_id];
      if (!team) {
        team = {
          id: row.team_id,
          name: row.team_name,
          parent_id: row.parent_id,
          metadata: row.metadata,
          members: [],
          children: [],
          full_path: '', // computed later
        };
        teamsById[row.team_id] = team;
        teamsArray.push(team);
      }

      if (row.user_id) {
        // Avoid duplicate members in case of multiple roles or duplicate rows
        if (!team.members?.some((member) => member.id === row.user_id)) {
          team?.members?.push({
            id: row.user_id,
            name: row.user_name,
            email: row.user_email,
            role: row.role,
            is_active: row.is_active,
          });
        }
      }
    }

    // Build the hierarchical structure
    const rootTeams: Team[] = [];
    for (const team of teamsArray) {
      if (team.parent_id) {
        const parentTeam = teamsById[team.parent_id];
        if (parentTeam) {
          parentTeam.children?.push(team);
        }
      } else {
        rootTeams.push(team);
      }
    }

    // Compute the full path for each team
    const computeFullPath = (team: Team, path: string) => {
      team.full_path = path ? `${path} > ${team.name}` : team.name;
      for (const child of team.children || []) {
        computeFullPath(child, team.full_path);
      }
    };

    for (const rootTeam of rootTeams) {
      computeFullPath(rootTeam, '');
    }

    return rootTeams;
  } catch (error) {
    console.error('Error fetching teams with members:', error);
    throw new Error('Failed to fetch teams with members');
  }
}
