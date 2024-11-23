export const getTeamsQuery = `
  SELECT 
    id,
    name,
    department,
    parent_id,
    created_at,
    metadata
  FROM teams
  ORDER BY name;
`;

export const getTeamsWithMembersQuery = `
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
