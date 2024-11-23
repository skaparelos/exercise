import pool from '@/lib/db';
import { User } from '@/types/users';
import { createUserQuery, getAllUsersQuery } from '@/lib/queries/users';

export async function getAllUsers(): Promise<User[]> {
  try {
    const { rows } = await pool.query<User>(getAllUsersQuery);
    return rows;
  } catch (error) {
    console.error('Error getting all users:', error);
    throw error;
  }
}

export async function createUser(user: User): Promise<User> {
  try {
    const { rows } = await pool.query<User>(createUserQuery, [user.email, user.name]);
    return rows[0];
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
} 
