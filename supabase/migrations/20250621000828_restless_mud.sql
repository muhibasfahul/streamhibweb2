-- Migration: Add role and expiryDate columns to Users table
-- Date: 2025-01-13

-- Add role column
ALTER TABLE "Users" 
ADD COLUMN IF NOT EXISTS "role" VARCHAR(255) DEFAULT 'user' CHECK ("role" IN ('user', 'admin'));

-- Add expiryDate column  
ALTER TABLE "Users"
ADD COLUMN IF NOT EXISTS "expiryDate" TIMESTAMP WITH TIME ZONE;

-- Update existing users to have 'user' role
UPDATE "Users" SET "role" = 'user' WHERE "role" IS NULL;

-- Create admin user (change password hash as needed)
INSERT INTO "Users" (
  "id", 
  "email", 
  "password", 
  "fullName", 
  "role", 
  "status", 
  "createdAt", 
  "updatedAt"
) VALUES (
  gen_random_uuid(),
  'admin@streamhib.com',
  '$2a$12$LQv3c1yqBwEHxE6FHMPgAuEFwdTDMnGFqRGiYjvEQdDwjKHDSGhV.',  -- password: admin123
  'Admin StreamHib',
  'admin',
  'active',
  NOW(),
  NOW()
) ON CONFLICT ("email") DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "idx_users_role" ON "Users" ("role");
CREATE INDEX IF NOT EXISTS "idx_users_status" ON "Users" ("status");
CREATE INDEX IF NOT EXISTS "idx_users_expiry" ON "Users" ("expiryDate");