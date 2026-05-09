-- Initialize AI Digital Twin Creator Database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_businesses_owner ON businesses(owner_id);
CREATE INDEX IF NOT EXISTS idx_digital_twins_business ON digital_twins(business_id);
CREATE INDEX IF NOT EXISTS idx_conversations_twin ON conversations(digital_twin_id);
CREATE INDEX IF NOT EXISTS idx_conversations_created ON conversations(created_at);

-- Insert sample data for testing (optional)
-- Note: These are example inserts for development purposes
-- In production, users should register through the application

-- Sample user (password: testpassword123 - hashed with bcrypt)
-- INSERT INTO users (email, hashed_password, full_name, is_active)
-- VALUES ('test@example.com', '$2b$12$test_hash_here', 'Test User', true)
-- ON CONFLICT (email) DO NOTHING;

-- Grant permissions (adjust as needed for your setup)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO user;
