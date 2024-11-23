export const getTeamsQuery = `
  SELECT 
    id,
    name,
    department,
    parent_id,
    metadata
  FROM teams
  ORDER BY name;
`;

export const getAllTeamsWithMembersQuery = `
  SELECT 
    t.id AS team_id,
    t.name AS team_name,
    t.parent_id,
    t.metadata,
    u.id AS user_id,
    u.name AS user_name,
    u.email AS user_email,
    tm.role,
    tm.is_active
  FROM teams t
  LEFT JOIN team_members tm ON t.id = tm.team_id
  LEFT JOIN users u ON tm.member_id = u.id
  ORDER BY t.id, u.name;
`;


export const getTeamQuery = `
  SELECT 
    t.id,
    t.name,
    t.department,
    t.parent_id,
    t.metadata,
    COALESCE(
      jsonb_agg(
        DISTINCT jsonb_build_object(
          'id', u.id,
          'name', u.name,
          'email', u.email,
          'role', tm.role,
          'is_active', tm.is_active
        )
      ) FILTER (WHERE u.id IS NOT NULL),
      '[]'
    ) as members
  FROM teams t
  LEFT JOIN team_members tm ON t.id = tm.team_id
  LEFT JOIN users u ON tm.member_id = u.id
  WHERE t.id = $1
  GROUP BY t.id, t.name, t.department, t.parent_id, t.metadata;
`;


