import { NextApiRequest, NextApiResponse } from 'next'
import pool from '@/lib/db'
import {
  updateTeamQuery,
  deleteTeamMembersQuery,
  insertTeamMembersQuery,
  getUpdatedTeamQuery
} from '@/lib/queries/teams'


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const teamId = parseInt(req.query.id as string)
    const { name, department, parent_id, members } = req.body

    // Start transaction
    await pool.query('BEGIN')

    // Update team
    const teamResult = await pool.query(updateTeamQuery, [
      name,
      department,
      parent_id,
      teamId
    ])

    if (teamResult.rowCount === 0) {
      throw new Error('Team not found')
    }

    // Delete existing team members
    await pool.query(deleteTeamMembersQuery, [teamId])

    // Insert new team members
    if (members && members.length > 0) {
      // Validate member data
      if (!members.every(member => member && member.id)) {
        throw new Error('Invalid member data: All members must have an id')
      }

      const memberParams = members.flatMap((member: any) => [
        member.id,
        teamId,
        member.role,
        member.is_active ?? true  // Default to true if not specified
      ])

      await pool.query(insertTeamMembersQuery(members.length), memberParams)
    }

    // Get updated team with members
    const updatedTeam = await pool.query(getUpdatedTeamQuery, [teamId])

    // Commit transaction
    await pool.query('COMMIT')

    return res.status(200).json(updatedTeam.rows[0])

  } catch (error) {
    // Rollback transaction on error
    await pool.query('ROLLBACK')

    console.error('Error updating team:', error)
    return res.status(500).json({
      message: 'Error updating team',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}