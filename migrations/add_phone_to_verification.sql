-- Add phone field to verification_codes table if not exists
ALTER TABLE verification_codes ADD COLUMN IF NOT EXISTS phone VARCHAR(20);

-- Add index for phone lookups
CREATE INDEX IF NOT EXISTS idx_verification_codes_phone ON verification_codes(phone);

-- Make sure both email and phone can be null (one or the other required)
ALTER TABLE verification_codes ALTER COLUMN email DROP NOT NULL;
