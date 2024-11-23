import type { NextApiRequest, NextApiResponse } from "next";
import { User } from "@/types/users";
import { getAllUsers } from "@/lib/services/userService";

interface ApiResponse {
  data: User[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse | { error: string }>
) {
  if (req.method === 'GET') {
    try {
      const users = await getAllUsers();

      return res.status(200).json({
        data: users,
      });
    } catch (error) {
      console.error('Database error:', error);
      return res.status(500).json({
        error: 'Failed to fetch users',
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
} 