import sqlite3
from sqlalchemy import create_engine, text

db_path = r'c:\Users\sarthak shavarn\OneDrive\Desktop\project\backend\digital_twin.db'
engine = create_engine(f'sqlite:///{db_path}')

columns = [
    ("oauth_provider", "VARCHAR(50)"),
    ("oauth_id", "VARCHAR(255)"),
    ("profile_picture", "VARCHAR(500)"),
    ("subscription_plan", "VARCHAR(50) DEFAULT 'starter'"),
    ("subscription_status", "VARCHAR(50) DEFAULT 'active'"),
    ("trial_started_at", "TIMESTAMP WITH TIME ZONE"),
    ("subscription_expires_at", "TIMESTAMP WITH TIME ZONE"),
    ("is_admin", "BOOLEAN DEFAULT FALSE"),
    ("has_used_trial", "BOOLEAN DEFAULT FALSE"),
    ("message_count", "INTEGER DEFAULT 0"),
    ("custom_features", "JSON DEFAULT '{}'"),
    ("preferences", "JSON DEFAULT '{\"conversation_summaries\": false}'")
]

print("Starting migration execution...")
for col_name, col_type in columns:
    try:
        with engine.begin() as conn:
            conn.execute(text(f"ALTER TABLE users ADD COLUMN {col_name} {col_type}"))
            print(f"Added column: {col_name}")
    except Exception as e:
        print(f"Skipped column {col_name} (likely already exists): {e}")

# Check columns now
print("\nVerifying schema...")
conn = sqlite3.connect(db_path)
cursor = conn.cursor()
cursor.execute("PRAGMA table_info(users)")
print("Final Columns:", [c[1] for c in cursor.fetchall()])
conn.close()
