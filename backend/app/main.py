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

# Create database tables
Base.metadata.create_all(bind=engine)

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
@app.get("/health")
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
