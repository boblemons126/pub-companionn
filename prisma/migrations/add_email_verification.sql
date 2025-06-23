-- Add email field to verification_codes table
ALTER TABLE verification_codes ADD COLUMN email VARCHAR(255);

-- Add index for email lookups
CREATE INDEX idx_verification_codes_email ON verification_codes(email);

-- Update users table to support email auth
ALTER TABLE users ALTER COLUMN phone DROP NOT NULL;
