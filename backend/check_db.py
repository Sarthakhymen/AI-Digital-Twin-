import sqlite3

def check_database():
    try:
        # Connect to the database
        conn = sqlite3.connect('digital_twin.db')
        cursor = conn.cursor()
        
        # Get list of tables
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = cursor.fetchall()
        print("--- Tables in Database ---")
        for table in tables:
            print(f"- {table[0]}")
        print("\n")
        
        # Check users table
        cursor.execute("SELECT name FROM sqlite_master WHERE name='users';")
        if cursor.fetchone():
            cursor.execute("SELECT id, email, full_name, is_active, created_at FROM users;")
            users = cursor.fetchall()
            print("--- Users Data ---")
            if not users:
                print("No users found in the database.")
            else:
                print(f"{'ID':<5} | {'Email':<30} | {'Full Name':<20} | {'Active':<8} | {'Created At'}")
                print("-" * 90)
                for user in users:
                    print(f"{user[0]:<5} | {user[1]:<30} | {str(user[2]):<20} | {str(user[3]):<8} | {user[4]}")
        else:
            print("Users table does not exist yet.")
            
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_database()
