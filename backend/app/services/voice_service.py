import os
import asyncio
import edge_tts
from deepgram import DeepgramClient, PrerecordedOptions
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

class VoiceService:
    def __init__(self):
        self.dg_key = os.getenv("DEEPGRAM_API_KEY")
        self.gemini_key = os.getenv("GOOGLE_AI_STUDIO_KEY")
        
        # Initialize Gemini
        genai.configure(api_key=self.gemini_key)
        self.model = genai.GenerativeModel('gemini-1.5-flash')
        
        # Initialize Deepgram
        self.deepgram = DeepgramClient(self.dg_key)

    async def transcribe_audio(self, audio_content):
        """Sunne wala kaam (Speech-to-Text)"""
        try:
            options = PrerecordedOptions(
                model="nova-2",
                language="hi", # Primary Hindi but Nova-2 handles English too
                smart_format=True,
            )
            
            payload = {"buffer": audio_content}
            response = self.deepgram.listen.prerecorded.v("1").transcribe_file(payload, options)
            
            transcript = response.results.channels[0].alternatives[0].transcript
            return transcript
        except Exception as e:
            print(f"Deepgram Error: {e}")
            return None

    async def get_ai_response(self, text, history=[]):
        """Dimag wala kaam (LLM)"""
        try:
            chat = self.model.start_chat(history=history)
            system_prompt = (
                "You are a helpful and friendly Indian AI Digital Twin. "
                "Respond in a natural 'Hinglish' style (mix of Hindi and English). "
                "Keep your answers concise and conversational, just like a voice assistant (Siri). "
                "Do not use complex formatting like markdown bold or lists, as this will be spoken aloud."
            )
            
            response = chat.send_message(f"{system_prompt}\n\nUser: {text}")
            return response.text
        except Exception as e:
            print(f"Gemini Error: {e}")
            return "Maaf kijiye, mujhe samajhne mein thodi dikkat ho rahi hai. Kya aap phir se bol sakte hain?"

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
