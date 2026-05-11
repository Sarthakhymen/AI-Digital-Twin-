import os
import asyncio
import edge_tts
from livekit import api
from deepgram import DeepgramClient
from openai import AsyncOpenAI
from dotenv import load_dotenv

load_dotenv()

class VoiceService:
    def __init__(self):
        self.dg_key = os.getenv("DEEPGRAM_API_KEY")
        self.groq_key = os.getenv("GROQ_API_KEY")
        self.lk_api_key = os.getenv("LIVEKIT_API_KEY")
        self.lk_api_secret = os.getenv("LIVEKIT_API_SECRET")
        
        # Initialize Groq (OpenAI-compatible)
        self.client = AsyncOpenAI(
            api_key=self.groq_key,
            base_url="https://api.groq.com/openai/v1"
        ) if self.groq_key else None
        
        # Initialize Deepgram
        self.deepgram = DeepgramClient(api_key=self.dg_key) if self.dg_key else None

    async def transcribe_audio(self, audio_content):
        """Sunne wala kaam (Speech-to-Text)"""
        try:
            # Using dictionary for options to be safe across v3 versions
            options = {
                "model": "nova-2",
                "language": "hi",
                "smart_format": True,
            }
            
            payload = {"buffer": audio_content}
            
            # Use the synchronous transcribe_file but we can wrap it if needed
            # In v3, listen.prerecorded.v("1").transcribe_file is standard
            response = self.deepgram.listen.prerecorded.v("1").transcribe_file(payload, options)
            
            # Extract transcript safely
            if hasattr(response, 'results'):
                transcript = response.results.channels[0].alternatives[0].transcript
                return transcript
            else:
                # Handle case where response is a dict
                return response['results']['channels'][0]['alternatives'][0]['transcript']
                
        except Exception as e:
            print(f"Deepgram Error: {e}")
            return None

    async def get_ai_response(self, text, profile={}):
        """Dimag wala kaam (LLM) - Using Groq for speed"""
        try:
            twin_name = profile.get("name", "AI Twin")
            business_name = profile.get("business_name", "our business")
            
            system_prompt = (
                f"You are {twin_name}, a friendly human staff member at {business_name}. "
                "Respond in a natural 'Hinglish' style. "
                "Keep your answers VERY CONCISE (max 1-2 short sentences). "
                "Do not use markdown formatting. Talk like a person on a phone call."
            )
            
            response = await self.client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": text}
                ],
                temperature=0.3,
                max_tokens=150
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"Groq Voice Error: {e}")
            return "Maaf kijiye, connectivity issue ki wajah se main sun nahi paayi. Kya aap phir se bolenge?"

    def generate_livekit_token(self, participant_name: str, room_name: str):
        """Generate Access Token for LiveKit room"""
        try:
            token = api.AccessToken(self.lk_api_key, self.lk_api_secret) \
                .with_identity(participant_name) \
                .with_name(participant_name) \
                .with_grants(api.VideoGrants(
                    room_join=True,
                    room=room_name,
                ))
            return token.to_jwt()
        except Exception as e:
            print(f"LiveKit Token Error: {e}")
            return None

    async def text_to_speech(self, text, output_path):
        """Bolne wala kaam (Text-to-Speech) - Using Edge-TTS (Free & High Quality)"""
        try:
            # Indian English/Hindi voice
            voice = "hi-IN-MadhurNeural" # Or "en-IN-NeerjaNeural"
            communicate = edge_tts.Communicate(text, voice)
            await communicate.save(output_path)
            return True
        except Exception as e:
            print(f"Edge-TTS Error: {e}")
            return False

voice_service = VoiceService()
