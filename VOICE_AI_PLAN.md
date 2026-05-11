# 🎙️ Voice AI Digital Twin - Implementation Plan

This plan outlines the steps to integrate real-time voice calling capabilities into the AI Digital Twin platform.

## 🎯 Objective
Enable users to call a dedicated phone number and interact with their AI Digital Twin via natural voice conversation with <200ms latency.

## 🛠️ Recommended Tech Stack
- **Orchestration**: [Vapi.ai](https://vapi.ai) or [Retell AI](https://retellai.com) (Best for low-latency voice loops).
- **Telephony**: Twilio (For purchasing and managing phone numbers).
- **Speech-to-Text (STT)**: Deepgram (Fastest transcription).
- **LLM (The Brain)**: Existing Groq Llama-3 integration (Sub-100ms reasoning).
- **Text-to-Speech (TTS)**: ElevenLabs or Play.ht (Most natural human voices).

---

## 📅 Phase 1: Backend Infrastructure (Week 1)
1. **Webhook Development**:
   - Create `/api/voice/webhook` to handle incoming call events.
   - Secure the endpoint to only allow requests from the voice provider.
2. **Conversation Service Update**:
   - Refactor `conversation_service.py` to support streaming responses (essential for voice).
3. **Provider Integration**:
   - Connect Vapi/Retell to our backend.
   - Map `twin_id` from the phone number to the correct AI personality.

## 🎨 Phase 2: Frontend Management (Week 1-2)
1. **Phone Number Dashboard**:
   - Create a UI for users to "Claim a Phone Number".
   - Show call logs and recordings in the user dashboard.
2. **Voice Settings**:
   - Allow users to choose different AI voices (Male/Female, Accents).
   - Set "Wait time" and "Interruption sensitivity".

## 🧪 Phase 3: Testing & Polish (Week 2)
1. **Latency Optimization**:
   - Ensure the "Groq + ElevenLabs" loop is optimized for real-time feel.
2. **Handling Interruptions**:
   - Logic to stop the AI from speaking if the user starts talking mid-sentence.
3. **Production Deployment**:
   - Scale the websocket connections for multiple simultaneous calls.

---

## 🛠️ Immediate Next Steps
1. [ ] Sign up for Vapi.ai / Retell AI developer accounts.
2. [ ] Create the `/voice` router in the FastAPI backend.
3. [ ] Update the `DigitalTwin` database model to store `phone_number`.
