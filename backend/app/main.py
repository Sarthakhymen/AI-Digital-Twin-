"""
AI Digital Twin Creator - Main Application
FastAPI application entry point
"""

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import os

from .database import engine, Base
from .api import auth, businesses, digital_twins, analytics, dashboard, integrations, whatsapp, knowledge, google_auth, voice, payments, admin
from sqlalchemy import text

# Create database tables
Base.metadata.create_all(bind=engine)

def run_migrations():
    """Run simple migrations to update database schema"""
    print("Running migrations...")
    try:
        with engine.begin() as conn:
            # List of columns to check/add
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
                ("custom_features", "JSON DEFAULT '{}'")
            ]
            
            for col_name, col_type in columns:
                try:
                    if "sqlite" not in str(engine.url):
                        # PostgreSQL specific check and add
                        conn.execute(text(f"""
                            DO $$
                            BEGIN
                                IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                                             WHERE table_name='users' AND column_name='{col_name}') THEN
                                    ALTER TABLE users ADD COLUMN {col_name} {col_type};
                                END IF;
                            END
                            $$;
                        """))
                    else:
                        # SQLite simple add (will fail if exists, which we catch)
                        conn.execute(text(f"ALTER TABLE users ADD COLUMN {col_name} {col_type}"))
                except Exception:
                    # Ignore errors (column likely already exists)
                    pass
            
            # Ensure hashed_password is nullable for OAuth users
            try:
                if "sqlite" not in str(engine.url):
                    conn.execute(text("ALTER TABLE users ALTER COLUMN hashed_password DROP NOT NULL;"))
            except Exception as e:
                print(f"Hashed password migration error (non-critical): {e}")
            # Create manual_payments table if not exists (for SQLite/Postgres)
            if "sqlite" in str(engine.url):
                conn.execute(text("""
                    CREATE TABLE IF NOT EXISTS manual_payments (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        user_id INTEGER REFERENCES users(id),
                        email VARCHAR(255) NOT NULL,
                        transaction_id VARCHAR(100) NOT NULL UNIQUE,
                        amount FLOAT DEFAULT 0.0,
                        status VARCHAR(50) DEFAULT 'pending',
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        verified_at DATETIME
                    );
                """))
            else:
                conn.execute(text("""
                    CREATE TABLE IF NOT EXISTS manual_payments (
                        id SERIAL PRIMARY KEY,
                        user_id INTEGER REFERENCES users(id),
                        email VARCHAR(255) NOT NULL,
                        transaction_id VARCHAR(100) NOT NULL UNIQUE,
                        amount FLOAT DEFAULT 0.0,
                        status VARCHAR(50) DEFAULT 'pending',
                        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                        verified_at TIMESTAMP WITH TIME ZONE
                    );
                """))
                # Add user_id column if table already exists without it
                try:
                    conn.execute(text("""
                        DO $$
                        BEGIN
                            IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                                         WHERE table_name='manual_payments' AND column_name='user_id') THEN
                                ALTER TABLE manual_payments ADD COLUMN user_id INTEGER REFERENCES users(id);
                            END IF;
                        END
                        $$;
                    """))
                except Exception:
                    pass

            # Create pro_waitlist table
            if "sqlite" in str(engine.url):
                conn.execute(text("""
                    CREATE TABLE IF NOT EXISTS pro_waitlist (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        full_name VARCHAR(255) NOT NULL,
                        email VARCHAR(255) NOT NULL UNIQUE,
                        phone VARCHAR(50),
                        business_name VARCHAR(255),
                        message TEXT,
                        status VARCHAR(50) DEFAULT 'waiting',
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                    );
                """))
            else:
                conn.execute(text("""
                    CREATE TABLE IF NOT EXISTS pro_waitlist (
                        id SERIAL PRIMARY KEY,
                        full_name VARCHAR(255) NOT NULL,
                        email VARCHAR(255) NOT NULL UNIQUE,
                        phone VARCHAR(50),
                        business_name VARCHAR(255),
                        message TEXT,
                        status VARCHAR(50) DEFAULT 'waiting',
                        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                    );
                """))

    except Exception as e:
        print(f"Migration error: {e}")

# Run migrations on startup
run_migrations()

# Security
security = HTTPBearer()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    # Startup
    print("Starting up AI Digital Twin Creator API...")
    yield
    # Shutdown
    print("Shutting down...")

# Initialize FastAPI app
app = FastAPI(
    title="AI Digital Twin Creator API",
    description="AI-powered digital twin creation platform for small business owners",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure uploads directory exists
os.makedirs("uploads/voice_samples", exist_ok=True)

# Mount static files
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Root endpoint
@app.get("/")
def root():
    return {
        "message": "AI Digital Twin Creator API",
        "version": "1.0.0",
        "docs": "/docs"
    }

# Health check endpoint
@app.api_route("/health", methods=["GET", "HEAD"])
def health_check():
    return {"status": "healthy"}

# Include API routers with /api/v1 prefix
app.include_router(auth.router, prefix="/api/v1")
app.include_router(google_auth.router, prefix="/api/v1")
app.include_router(businesses.router, prefix="/api/v1")
app.include_router(digital_twins.router, prefix="/api/v1")
app.include_router(analytics.router, prefix="/api/v1")
app.include_router(dashboard.router, prefix="/api/v1")
app.include_router(integrations.router, prefix="/api/v1")
app.include_router(whatsapp.router, prefix="/api/v1/whatsapp", tags=["whatsapp"])
app.include_router(knowledge.router, prefix="/api/v1")
app.include_router(voice.router, prefix="/api/voice", tags=["voice"])
app.include_router(payments.router, prefix="/api/v1")
app.include_router(admin.router, prefix="/api/v1")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
