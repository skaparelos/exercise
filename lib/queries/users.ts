export const getAllUsersQuery = `
  SELECT id, name, email
  FROM users
  ORDER BY created_at DESC
`;

export const createUserQuery = `
  INSERT INTO users (email, name) VALUES ($1, $2) RETURNING id, name, email
`;
