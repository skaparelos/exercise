-- Insert test teams
INSERT INTO teams (name, department) VALUES 
    ('Engineering', 'Tech'),
    ('Frontend', 'Tech'),
    ('Backend', 'Tech'),
    ('Marketing', 'Business'),
    ('Sales', 'Business'),
    ('React', 'Tech')
ON CONFLICT (name, parent_id) DO NOTHING;

-- Update parent relationships
WITH team_refs AS (
    SELECT id, name FROM teams
)
UPDATE teams SET 
    parent_id = (SELECT id FROM team_refs WHERE name = 'Engineering')
WHERE name IN ('Frontend', 'Backend');

WITH team_refs AS (
    SELECT id, name FROM teams
)
UPDATE teams SET 
    parent_id = (SELECT id FROM team_refs WHERE name = 'Frontend')
WHERE name = 'React';

-- Insert test users
INSERT INTO users (name, email) VALUES 
    ('John Doe', 'john@example.com'),
    ('Jane Smith', 'jane@example.com'),
    ('Bob Wilson', 'bob@example.com'),
    ('Alice Johnson', 'alice@example.com'),
    ('Sarah Miller', 'sarah@example.com'),
    ('Mike Brown', 'mike@example.com'),
    ('Emily Davis', 'emily@example.com'),
    ('James Wilson', 'james@example.com')
ON CONFLICT (email) DO NOTHING;

-- Assign users to teams 
WITH user_refs AS (
    SELECT id, email FROM users
),
team_refs AS (
    SELECT id, name FROM teams
)
INSERT INTO team_members (member_id, team_id, role, is_active) 
SELECT 
    u.id,
    t.id,
    CASE 
        WHEN u.email = 'john@example.com' THEN 'ADMIN'
        ELSE 'MEMBER'
    END,
    true
FROM (
    -- Explicitly define user-team pairs
    SELECT email, team_name FROM (
        VALUES 
            ('john@example.com', 'Engineering'),
            ('john@example.com', 'Frontend'),
            ('jane@example.com', 'Frontend'),
            ('alice@example.com', 'Backend'),
            ('bob@example.com', 'Sales'),
            ('sarah@example.com', 'Sales'),
            ('mike@example.com', 'Sales'),
            ('emily@example.com', 'React'),
            ('james@example.com', 'React')
    ) AS pairs(email, team_name)
) pairs
JOIN user_refs u ON u.email = pairs.email
JOIN team_refs t ON t.name = pairs.team_name
ON CONFLICT DO NOTHING;