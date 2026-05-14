import sqlite3
import os

# Path to the database file
db_path = "backend/sql_app.db"

def set_admin(email):
    if not os.path.exists(db_path):
        print(f"Error: Database file not found at {db_path}")
        return

    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Check if user exists
        cursor.execute("SELECT id FROM users WHERE email = ?", (email,))
        user = cursor.fetchone()
        
        if user:
            cursor.execute("UPDATE users SET is_admin = 1 WHERE email = ?", (email,))
            conn.commit()
            print(f"SUCCESS: User {email} is now an ADMIN.")
        else:
            print(f"ERROR: User with email {email} not found in database.")
            
        conn.close()
    except Exception as e:
        print(f"Database error: {e}")

if __name__ == "__main__":
    set_admin("nexora.aidigital.twin@gmail.com")
