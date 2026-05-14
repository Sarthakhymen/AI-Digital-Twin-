"""
Knowledge Base API Routes — Upload PDFs/Text to train Digital Twins
"""
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from fastapi.security import HTTPBearer
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..services.auth_service import get_current_user
from ..models import DigitalTwin, Business, KnowledgeDocument, KnowledgeChunk, User
import io

router = APIRouter(prefix="/knowledge", tags=["Knowledge Base"])
security = HTTPBearer()

def get_current_user_dependency(
    credentials: HTTPBearer = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    token = credentials.credentials
    return get_current_user(db, token)


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
    current_user: User = Depends(get_current_user_dependency),
    db: Session = Depends(get_db)
):
    """Upload a PDF/TXT file to train a Digital Twin's knowledge base"""
    # Check subscription status
    if current_user.subscription_status == "expired":
        raise HTTPException(status_code=403, detail="Subscription expired. Please upgrade to Pro to manage knowledge base.")
    
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
    current_user: User = Depends(get_current_user_dependency),
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
    current_user: User = Depends(get_current_user_dependency),
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
