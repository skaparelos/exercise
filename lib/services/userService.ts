import pool from '@/lib/db';
import { User } from '@/types/users';
import { getAllUsersQuery } from '@/lib/queries/users';

export async function getAllUsers(): Promise<User[]> {
  try {
    const { rows } = await pool.query<User>(getAllUsersQuery);
    return rows;
  } catch (error) {
    console.error('Error getting all users:', error);
    throw error;
  }
}
