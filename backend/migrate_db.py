import os
import sys
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    print("Error: DATABASE_URL not found in .env")
    sys.exit(1)

# Ensure psycopg2 is used for Postgres URLs
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

print(f"Connecting to database...")

try:
    engine = create_engine(DATABASE_URL)
    with engine.connect() as connection:
        # Add has_used_trial
        try:
            print("Adding has_used_trial column...")
            connection.execute(text("ALTER TABLE users ADD COLUMN has_used_trial BOOLEAN DEFAULT FALSE;"))
            connection.commit()
            print("✅ has_used_trial column added successfully.")
        except Exception as e:
            if "already exists" in str(e).lower() or "duplicate column" in str(e).lower():
                print("Column has_used_trial already exists.")
            else:
                print(f"Error adding has_used_trial: {e}")

        # Add message_count
        try:
            print("Adding message_count column...")
            connection.execute(text("ALTER TABLE users ADD COLUMN message_count INTEGER DEFAULT 0;"))
            connection.commit()
            print("✅ message_count column added successfully.")
        except Exception as e:
            if "already exists" in str(e).lower() or "duplicate column" in str(e).lower():
                print("Column message_count already exists.")
            else:
                print(f"Error adding message_count: {e}")

    print("\n🎉 Database migration complete! The error should now be fixed.")

except Exception as e:
    print(f"\n❌ Failed to connect to database or execute query: {e}")
