import os
import uuid
import base64
from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.voice_service import voice_service

router = APIRouter()

# Temporary directory for audio files
TEMP_DIR = "temp_audio"
if not os.path.exists(TEMP_DIR):
    os.makedirs(TEMP_DIR)

@router.post("/process-voice")
async def process_voice(file: UploadFile = File(...)):
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
