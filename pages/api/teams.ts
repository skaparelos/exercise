import type { NextApiRequest, NextApiResponse } from 'next';
import { getTeamsWithMembers } from '@/lib/services/teamService';
import { Team } from '@/types/teams';

interface ApiResponse {
  data: Team[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const result = await getTeamsWithMembers();
    res.status(200).json({ data: result });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to fetch teams' });
  }
} 