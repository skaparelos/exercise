import pool from '@/lib/db';
import { User } from '@/types/users';
import { getAllUsersQuery } from '@/lib/queries/users';

export async function getAllUsers(): Promise<User[]> {
  const { rows } = await pool.query<User>(getAllUsersQuery);
  return rows;
}
