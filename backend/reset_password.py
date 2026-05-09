import sqlite3
import argparse
from passlib.context import CryptContext

# Standard bcrypt context (same as your auth_service.py)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def reset_user_password(email: str, new_password: str):
    try:
        conn = sqlite3.connect('digital_twin.db')
        cursor = conn.cursor()
        
        # Hash the new password
        hashed_password = get_password_hash(new_password)
        
        # Update the database
        cursor.execute("UPDATE users SET hashed_password = ? WHERE email = ?", (hashed_password, email))
        
        if cursor.rowcount > 0:
            conn.commit()
            print(f"✅ Success: Password for {email} has been updated!")
            print(f"Ab user '{new_password}' password use karke login kar sakta hai.")
        else:
            print(f"❌ Error: User with email '{email}' not found.")
            
        conn.close()
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Reset a user's password manually.")
    parser.add_argument("--email", required=True, help="User's email address")
    parser.add_argument("--password", required=True, help="New password to set")
    
    args = parser.parse_args()
    reset_user_password(args.email, args.password)
