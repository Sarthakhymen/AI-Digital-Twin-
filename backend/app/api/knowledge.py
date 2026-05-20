"""
Knowledge Base API Routes — Upload PDFs/Text to train Digital Twins
Also supports URL Scraping (Standard+ plan) and Lead management
"""
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from fastapi.security import HTTPBearer
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from ..database import get_db
from ..services.auth_service import get_current_user
from ..models import DigitalTwin, Business, KnowledgeDocument, KnowledgeChunk, LeadCapture, User
import io

router = APIRouter(prefix="/knowledge", tags=["Knowledge Base"])
from .dependencies import RequirePlan, get_current_active_user


def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extract text from a PDF file using PyPDF2"""
    from PyPDF2 import PdfReader
    reader = PdfReader(io.BytesIO(file_bytes))
    text = ""
    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            text += page_text + "\n"
    return text.strip()


def chunk_text(text: str, chunk_size: int = 500, overlap: int = 50) -> list:
    """Split text into overlapping chunks for better context retrieval"""
    chunks = []
    # Split by paragraphs first, then by size
    paragraphs = [p.strip() for p in text.split("\n") if p.strip()]
    
    current_chunk = ""
    for para in paragraphs:
        if len(current_chunk) + len(para) + 1 <= chunk_size:
            current_chunk += para + "\n"
        else:
            if current_chunk:
                chunks.append(current_chunk.strip())
            # If paragraph itself is bigger than chunk_size, split it
            if len(para) > chunk_size:
                words = para.split()
                current_chunk = ""
                for word in words:
                    if len(current_chunk) + len(word) + 1 <= chunk_size:
                        current_chunk += word + " "
                    else:
                        chunks.append(current_chunk.strip())
                        # Keep overlap from previous chunk
                        overlap_words = current_chunk.split()[-overlap//5:] if overlap else []
                        current_chunk = " ".join(overlap_words) + " " + word + " "
            else:
                current_chunk = para + "\n"
    
    if current_chunk.strip():
        chunks.append(current_chunk.strip())
    
    return chunks


@router.post("/{twin_id}/upload")
async def upload_knowledge_document(
    twin_id: int,
    file: UploadFile = File(...),
    current_user: User = Depends(RequirePlan(["standard", "business_pro"], feature_name="knowledge_upload")),
    db: Session = Depends(get_db)
):
    """Upload a PDF/TXT file to train a Digital Twin's knowledge base"""
    # 1. Verify twin ownership
    twin = db.query(DigitalTwin).join(Business).filter(
        DigitalTwin.id == twin_id,
        Business.owner_id == current_user.id
    ).first()
    
    if not twin:
        raise HTTPException(status_code=404, detail="Digital twin not found")
    
    # 2. Validate file type
    allowed_types = ["application/pdf", "text/plain"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400, 
            detail=f"Unsupported file type: {file.content_type}. Only PDF and TXT files are supported."
        )
    
    # 3. Read file contents
    file_bytes = await file.read()
    file_size = len(file_bytes)
    
    # Max 10MB
    if file_size > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large. Maximum size is 10MB.")
    
    # 4. Extract text
    try:
        if file.content_type == "application/pdf":
            text = extract_text_from_pdf(file_bytes)
        else:
            text = file_bytes.decode("utf-8")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to extract text: {str(e)}")
    
    if not text or len(text.strip()) < 10:
        raise HTTPException(status_code=400, detail="No readable text found in the file.")
    
    # 5. Create document record
    doc = KnowledgeDocument(
        digital_twin_id=twin_id,
        filename=file.filename,
        file_type="pdf" if file.content_type == "application/pdf" else "txt",
        file_size=file_size,
        status="processing"
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)
    
    # 6. Chunk the text and store
    chunks = chunk_text(text)
    
    for i, chunk_content in enumerate(chunks):
        chunk = KnowledgeChunk(
            document_id=doc.id,
            digital_twin_id=twin_id,
            content=chunk_content,
            chunk_index=i
        )
        db.add(chunk)
    
    doc.chunk_count = len(chunks)
    doc.status = "ready"
    db.commit()
    
    return {
        "message": f"Successfully processed '{file.filename}'",
        "document_id": doc.id,
        "chunks_created": len(chunks),
        "text_length": len(text)
    }


@router.get("/{twin_id}/documents")
def list_knowledge_documents(
    twin_id: int,
    current_user: User = Depends(RequirePlan(["standard", "business_pro"], feature_name="knowledge_upload")),
    db: Session = Depends(get_db)
):
    """List all knowledge documents for a Digital Twin"""
    
    # Verify ownership
    twin = db.query(DigitalTwin).join(Business).filter(
        DigitalTwin.id == twin_id,
        Business.owner_id == current_user.id
    ).first()
    
    if not twin:
        raise HTTPException(status_code=404, detail="Digital twin not found")
    
    docs = db.query(KnowledgeDocument).filter(
        KnowledgeDocument.digital_twin_id == twin_id
    ).order_by(KnowledgeDocument.created_at.desc()).all()
    
    return [
        {
            "id": doc.id,
            "filename": doc.filename,
            "file_type": doc.file_type,
            "file_size": doc.file_size,
            "chunk_count": doc.chunk_count,
            "status": doc.status,
            "created_at": doc.created_at.isoformat() if doc.created_at else None
        }
        for doc in docs
    ]


@router.delete("/{twin_id}/documents/{doc_id}")
def delete_knowledge_document(
    twin_id: int,
    doc_id: int,
    current_user: User = Depends(RequirePlan(["standard", "business_pro"], feature_name="knowledge_upload")),
    db: Session = Depends(get_db)
):
    """Delete a knowledge document and all its chunks"""
    
    twin = db.query(DigitalTwin).join(Business).filter(
        DigitalTwin.id == twin_id,
        Business.owner_id == current_user.id
    ).first()
    
    if not twin:
        raise HTTPException(status_code=404, detail="Digital twin not found")
    
    doc = db.query(KnowledgeDocument).filter(
        KnowledgeDocument.id == doc_id,
        KnowledgeDocument.digital_twin_id == twin_id
    ).first()
    
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    
    db.delete(doc)
    db.commit()
    
    return {"message": f"Document '{doc.filename}' deleted successfully"}


# ============ URL SCRAPING (Standard+ Plan) ============

class UrlScrapeRequest(BaseModel):
    url: str

def scrape_url_text(url: str) -> str:
    """
    Free web scraper using requests + BeautifulSoup.
    If no text is returned (e.g. JS-heavy SPA), falls back to Jina Reader API.
    """
    import requests
    from bs4 import BeautifulSoup
    
    headers = {"User-Agent": "Mozilla/5.0 (compatible; AI-Digital-Twin-Bot/1.0; +https://sahayak.ai)"}
    try:
        resp = requests.get(url, headers=headers, timeout=15)
        resp.raise_for_status()
    except requests.exceptions.Timeout:
        raise ValueError("The website took too long to respond. Connection timed out.")
    except requests.exceptions.ConnectionError as e:
        err_msg = str(e)
        if "NameResolutionError" in err_msg or "Failed to resolve" in err_msg or "Errno -2" in err_msg or "gaierror" in err_msg:
            raise ValueError("Could not find or resolve this website. Please check the spelling of the URL.")
        raise ValueError("Could not connect to the website. Please make sure the URL is active, public, and spelled correctly.")
    except requests.exceptions.HTTPError as e:
        status_code = e.response.status_code if e.response is not None else "HTTP"
        raise ValueError(f"The website returned an error (HTTP {status_code}). Please verify the URL.")
    except Exception as e:
        raise ValueError(f"Connection failed: {str(e)}")
    
    soup = BeautifulSoup(resp.text, "lxml")
    
    # Strip noisy tags
    for tag in soup(["script", "style", "nav", "footer", "header", "aside", "noscript", "iframe", "form"]):
        tag.decompose()
    
    # Prefer semantic content areas
    main = soup.find("main") or soup.find("article") or soup.find("section") or soup.find("body")
    text = main.get_text(separator="\n", strip=True) if main else soup.get_text(separator="\n", strip=True)
    
    # Collapse whitespace
    lines = [l.strip() for l in text.splitlines() if len(l.strip()) > 3]
    final_text = "\n".join(lines)
    
    # Fallback to Jina Reader if BS4 scraped too little content (suggests JS-rendered SPA)
    if len(final_text.strip()) < 150:
        try:
            jina_url = f"https://r.jina.ai/{url}"
            jina_resp = requests.get(jina_url, headers=headers, timeout=20)
            if jina_resp.status_code == 200:
                jina_lines = [l.strip() for l in jina_resp.text.splitlines() if len(l.strip()) > 3]
                jina_text = "\n".join(jina_lines)
                if len(jina_text.strip()) >= 50:
                    return jina_text
        except Exception:
            pass
            
    return final_text


@router.post("/{twin_id}/scrape-url")
async def scrape_url_to_knowledge(
    twin_id: int,
    body: UrlScrapeRequest,
    current_user: User = Depends(RequirePlan(["standard", "business_pro"], feature_name="url_scraping")),
    db: Session = Depends(get_db)
):
    """
    Scrape a URL and index its content into the Digital Twin's knowledge base.
    Standard plan feature — 100% free, powered by BeautifulSoup.
    """
    # 1. Verify ownership
    twin = db.query(DigitalTwin).join(Business).filter(
        DigitalTwin.id == twin_id,
        Business.owner_id == current_user.id
    ).first()
    if not twin:
        raise HTTPException(status_code=404, detail="Digital twin not found")
    
    # Clean accidental bullet point character at the start (e.g. "- digitaltwin.tech" or "-digitaltwin.tech")
    url = body.url.strip()
    while url.startswith(("-", "*", "•", " ", "\t", "\r", "\n", '"', "'")):
        url = url.lstrip("-*• \t\r\n\"'")
        
    if not url.startswith(("http://", "https://")):
        url = "https://" + url
    
    # Validate parsed domain labels
    from urllib.parse import urlparse
    try:
        parsed = urlparse(url)
        netloc = parsed.netloc
        if not netloc or any(label.startswith("-") or label.endswith("-") for label in netloc.split(".")):
            raise ValueError()
    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Invalid URL format. Please make sure the domain name is typed correctly (e.g., 'digitaltwin.tech')."
        )
    
    # 2. Scrape
    try:
        text = scrape_url_text(url)
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to scrape URL: {str(e)}")
    
    if not text or len(text) < 50:
        raise HTTPException(status_code=400, detail="Not enough readable content found at this URL.")
    
    # 3. Limit size
    text = text[:25000]  # ~25k chars per scrape
    
    # 4. Create doc record
    from urllib.parse import urlparse
    parsed = urlparse(url)
    filename = f"[Web] {parsed.netloc}{parsed.path}"[:120]
    
    doc = KnowledgeDocument(
        digital_twin_id=twin_id,
        filename=filename,
        file_type="url",
        file_size=len(text.encode()),
        status="processing"
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)
    
    # 5. Chunk & store
    chunks = chunk_text(text)
    for i, chunk_content in enumerate(chunks):
        chunk = KnowledgeChunk(
            document_id=doc.id,
            digital_twin_id=twin_id,
            content=chunk_content,
            chunk_index=i
        )
        db.add(chunk)
    
    doc.chunk_count = len(chunks)
    doc.status = "ready"
    db.commit()
    
    return {
        "message": f"Successfully scraped and indexed '{url}'",
        "document_id": doc.id,
        "chunks_created": len(chunks),
        "text_length": len(text),
        "url": url
    }


# ============ LEAD CAPTURES (Standard+ Plan) ============

class LeadCaptureCreate(BaseModel):
    name: Optional[str] = None
    email: str
    phone: Optional[str] = None
    message: Optional[str] = None


@router.post("/{twin_id}/leads")
def capture_lead_public(
    twin_id: int,
    body: LeadCaptureCreate,
    db: Session = Depends(get_db)
):
    """
    Public endpoint — called by the embedded chat widget when visitor submits email.
    No auth required (runs on customer's external website).
    """
    twin = db.query(DigitalTwin).filter(DigitalTwin.id == twin_id).first()
    if not twin:
        raise HTTPException(status_code=404, detail="Twin not found")
    
    lead = LeadCapture(
        digital_twin_id=twin_id,
        name=body.name,
        email=body.email,
        phone=body.phone,
        message=body.message,
        source="web_widget"
    )
    db.add(lead)
    db.commit()
    db.refresh(lead)
    
    return {"message": "Thanks! We'll be in touch soon.", "lead_id": lead.id}


@router.get("/leads/all")
def list_all_leads(
    current_user: User = Depends(RequirePlan(["standard", "business_pro"], feature_name="lead_generation")),
    db: Session = Depends(get_db)
):
    """View all captured leads across all Digital Twins belonging to the current user's businesses"""
    twins = db.query(DigitalTwin).join(Business).filter(
        Business.owner_id == current_user.id
    ).all()
    twin_ids = [t.id for t in twins]
    twin_names = {t.id: t.name for t in twins}
    
    if not twin_ids:
        return []
        
    leads = db.query(LeadCapture).filter(
        LeadCapture.digital_twin_id.in_(twin_ids)
    ).order_by(LeadCapture.created_at.desc()).all()
    
    return [
        {
            "id": l.id,
            "name": l.name,
            "email": l.email,
            "phone": l.phone,
            "message": l.message,
            "source": l.source,
            "digital_twin_id": l.digital_twin_id,
            "digital_twin_name": twin_names.get(l.digital_twin_id, "Unknown Twin"),
            "created_at": l.created_at.isoformat() if l.created_at else None
        }
        for l in leads
    ]


@router.get("/{twin_id}/leads")
def list_leads(
    twin_id: int,
    current_user: User = Depends(RequirePlan(["standard", "business_pro"], feature_name="lead_generation")),
    db: Session = Depends(get_db)
):
    """View all captured leads for a Digital Twin — Standard plan feature"""
    twin = db.query(DigitalTwin).join(Business).filter(
        DigitalTwin.id == twin_id,
        Business.owner_id == current_user.id
    ).first()
    if not twin:
        raise HTTPException(status_code=404, detail="Digital twin not found")
    
    leads = db.query(LeadCapture).filter(
        LeadCapture.digital_twin_id == twin_id
    ).order_by(LeadCapture.created_at.desc()).all()
    
    return [
        {
            "id": l.id,
            "name": l.name,
            "email": l.email,
            "phone": l.phone,
            "message": l.message,
            "source": l.source,
            "created_at": l.created_at.isoformat() if l.created_at else None
        }
        for l in leads
    ]
