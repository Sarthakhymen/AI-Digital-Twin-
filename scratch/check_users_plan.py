import sqlite3

db_path = r'c:\Users\sarthak shavarn\OneDrive\Desktop\project\backend\digital_twin.db'
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Get column names
cursor.execute("PRAGMA table_info(users)")
columns = [col[1] for col in cursor.fetchall()]
print("Columns:", columns)

# Get user records
cursor.execute("SELECT id, email, subscription_plan, subscription_status, subscription_expires_at FROM users")
for row in cursor.fetchall():
    print(row)

conn.close()
