ALTER TABLE customers ADD COLUMN is_admin BOOLEAN DEFAULT false;

-- Then set admin for specific user:
UPDATE customers SET is_admin = true WHERE email = 'ethanokamura3@gmail.com';