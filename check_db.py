import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv(dotenv_path="backend/.env")

db_url = os.getenv("DATABASE_URL")
print("Connecting to DB...")
engine = create_engine(db_url)

with engine.connect() as conn:
    result = conn.execute(text("SELECT id, email, subscription_plan, subscription_status, custom_features FROM users"))
    users = result.fetchall()
    print("\nUsers inside database:")
    for user in users:
        print(f"ID: {user[0]}, Email: {user[1]}, Plan: {user[2]}, Status: {user[3]}, Custom Features: {user[4]}")
