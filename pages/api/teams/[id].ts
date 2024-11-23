import { NextApiRequest, NextApiResponse } from 'next'
import pool from '@/lib/db'


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
    const updateTeamQuery = `
      UPDATE teams 
      SET name = $1, 
          department = $2, 
          parent_id = $3
      WHERE id = $4
      RETURNING *
    `
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
    await pool.query(
      'DELETE FROM team_members WHERE team_id = $1',
      [teamId]
    )

    // Insert new team members
    if (members && members.length > 0) {
      const memberValues = members.map((member: any, index: number) =>
        `($${index * 3 + 1}, $${index * 3 + 2}, $${index * 3 + 3})`
      ).join(', ')

      const memberParams = members.flatMap((member: any) => [
        member.id,
        teamId,
        member.role
      ])

      const insertMembersQuery = `
        INSERT INTO team_members (member_id, team_id, role)
        VALUES ${memberValues}
      `
      await pool.query(insertMembersQuery, memberParams)
    }

    // Get updated team with members
    const getUpdatedTeamQuery = `
      SELECT 
        t.*,
        json_agg(
          json_build_object(
            'member_id', tm.member_id,
            'role', tm.role,
            'user', json_build_object(
              'id', u.id,
              'name', u.name,
              'email', u.email
            )
          )
        ) as members
      FROM teams t
      LEFT JOIN team_members tm ON t.id = tm.team_id
      LEFT JOIN users u ON tm.member_id = u.id
      WHERE t.id = $1
      GROUP BY t.id
    `
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