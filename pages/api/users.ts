import type { NextApiRequest, NextApiResponse } from "next";
import { User } from "@/types/users";
import { getAllUsers, createUser } from "@/lib/services/userService";

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

  if (req.method === 'POST') {
    try {
      const userData = req.body;

      // Validate required fields
      if (!userData.email || !userData.name) {
        return res.status(400).json({
          error: 'Email and name are required',
        });
      }

      const newUser = await createUser(userData);

      return res.status(201).json({
        data: [newUser],
      });
    } catch (error) {
      console.error('Database error:', error);
      return res.status(500).json({
        error: 'Failed to create user',
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
} 