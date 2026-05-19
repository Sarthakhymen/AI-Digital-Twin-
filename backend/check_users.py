import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(DATABASE_URL)
with engine.connect() as conn:
    res = conn.execute(text("SELECT id, email, subscription_plan, subscription_status, has_used_trial, message_count FROM users"))
    print("USERS IN DATABASE:")
    print("-" * 100)
    for row in res:
        print(f"ID: {row[0]} | Email: {row[1]} | Plan: {row[2]} | Status: {row[3]} | Used Trial: {row[4]} | Message Count: {row[5]}")
    print("-" * 100)
