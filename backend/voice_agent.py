import logging
import os
from dotenv import load_dotenv
from livekit.agents import JobContext, WorkerOptions, cli, llm
from livekit.agents.voice_assistant import VoiceAssistant
from livekit.plugins import openai, deepgram, silero
import asyncio

load_dotenv()

logger = logging.getLogger("voice-agent")
logger.setLevel(logging.INFO)

async def entrypoint(ctx: JobContext):
    logger.info(f"Starting voice agent for room: {ctx.room.name}")

    # 1. Initialize LLM (Groq via OpenAI Plugin)
    # Groq is OpenAI compatible, so we can use the OpenAI plugin
    # and change the base_url.
    llm_engine = openai.LLM(
        model="llama-3.3-70b-versatile",
        base_url="https://api.groq.com/openai/v1",
        api_key=os.getenv("GROQ_API_KEY"),
    )

    # 2. Initialize STT (Deepgram)
    stt_engine = deepgram.STT(api_key=os.getenv("DEEPGRAM_API_KEY"))

    # 3. Initialize TTS (Deepgram Aura - Fast & High Quality)
    tts_engine = deepgram.TTS(model="aura-helios-en")

    # 4. Initialize the Assistant
    assistant = VoiceAssistant(
        vad=silero.VAD.load(),
        stt=stt_engine,
        llm=llm_engine,
        tts=tts_engine,
        chat_ctx=llm.ChatContext().append(
            role="system",
            text=(
                "You are a helpful AI assistant for a Digital Twin platform. "
                "Your goal is to have a natural, helpful conversation with the user. "
                "Keep your responses concise and human-like. "
                "You can speak both Hindi and English (Hinglish)."
            ),
        ),
    )

    # 5. Start the assistant in the room
    assistant.start(ctx.room)

    # Greet the user
    await assistant.say("Hello! I am your Digital Twin Voice Assistant. How can I help you today?", allow_interruptions=True)

if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint))
