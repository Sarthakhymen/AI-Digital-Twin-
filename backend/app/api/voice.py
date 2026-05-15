import os
import uuid
import base64
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from app.services.voice_service import voice_service
from .dependencies import RequirePlan
from ..models import User

router = APIRouter()

# Temporary directory for audio files
TEMP_DIR = "temp_audio"
if not os.path.exists(TEMP_DIR):
    os.makedirs(TEMP_DIR)

@router.get("/token")
async def get_token(
    participant_name: str, 
    room_name: str,
    current_user: User = Depends(RequirePlan(["business_pro"], feature_name="voice"))
):
    """
    Generates a LiveKit access token for a user to join a voice room.
    """
    token = voice_service.generate_livekit_token(participant_name, room_name)
    if not token:
        raise HTTPException(status_code=500, detail="Could not generate token")
    return {"token": token, "url": os.getenv("LIVEKIT_URL")}

@router.post("/process-voice")
async def process_voice(
    file: UploadFile = File(...),
    current_user: User = Depends(RequirePlan(["business_pro"], feature_name="voice"))
):
    """
    Receives audio, transcribes it, gets AI response, and converts back to speech.
    Returns: { "transcript": "...", "ai_response": "...", "audio_base64": "..." }
    """
    try:
        # 1. Save uploaded audio temporarily
        audio_content = await file.read()
        
        # 2. Transcribe (STT)
        try:
            transcript = await voice_service.transcribe_audio(audio_content)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"STT Error: {str(e)}")
            
        if not transcript:
            raise HTTPException(status_code=400, detail="Could not transcribe audio (Empty transcript)")
        
        # 3. Get AI Brain Response (LLM)
        try:
            ai_text = await voice_service.get_ai_response(transcript)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"LLM Error: {str(e)}")
        
        # 4. Convert Text to Speech (TTS)
        output_filename = f"{uuid.uuid4()}.mp3"
        output_path = os.path.join(TEMP_DIR, output_filename)
        
        try:
            success = await voice_service.text_to_speech(ai_text, output_path)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"TTS Error: {str(e)}")
        
        if not success:
            raise HTTPException(status_code=500, detail="TTS Generation Failed")
        
        # 5. Read generated audio and encode to base64
        with open(output_path, "rb") as audio_file:
            audio_base64 = base64.b64encode(audio_file.read()).decode('utf-8')
        
        # Cleanup temporary file
        os.remove(output_path)
        
        return {
            "transcript": transcript,
            "ai_response": ai_text,
            "audio_base64": audio_base64
        }
        
    except Exception as e:
        print(f"Voice Processing Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
