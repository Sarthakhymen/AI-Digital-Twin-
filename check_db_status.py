import sqlite3
import os

def check_db():
    db_path = r'c:\Users\sarthak shavarn\OneDrive\Desktop\project\backend\digital_twin.db'
    if not os.path.exists(db_path):
        print(f"Error: Database not found at {db_path}")
        return

    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        print("--- Users ---")
        cursor.execute("SELECT id, email FROM users")
        for row in cursor.fetchall():
            print(row)
            
        print("\n--- Businesses ---")
        cursor.execute("SELECT id, name, owner_id FROM businesses")
        for row in cursor.fetchall():
            print(row)
            
        print("\n--- Digital Twins ---")
        cursor.execute("SELECT id, name, status, business_id FROM digital_twins")
        twins = cursor.fetchall()
        for row in twins:
            print(row)
            
        if not twins:
            print("\n❌ NO DIGITAL TWINS FOUND! You need to create one in the dashboard first.")
        else:
            print(f"\n✅ Found {len(twins)} twin(s). Make sure to use one of these IDs in demo_widget.html.")
            
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_db()
