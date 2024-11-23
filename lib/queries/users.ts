export const getAllUsersQuery = `
  SELECT id, name, email
  FROM users
  ORDER BY created_at DESC
`;
