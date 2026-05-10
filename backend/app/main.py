"""
AI Digital Twin Creator - Main Application
FastAPI application entry point
"""

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from contextlib import asynccontextmanager

from .database import engine, Base
from .api import auth, businesses, digital_twins, analytics, dashboard, integrations, whatsapp, knowledge, google_auth
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
                ("profile_picture", "VARCHAR(500)")
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
                except Exception as e:
                    # Ignore errors (column likely already exists)
                    pass
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

# Root endpoint
@app.get("/")
def root():
    return {
        "message": "AI Digital Twin Creator API",
        "version": "1.0.0",
        "docs": "/docs"
    }

# Health check endpoint
@app.get("/health", methods=["GET", "HEAD"])
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
