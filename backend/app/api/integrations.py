"""
Public Integration API Routes (Web Widget, Webhooks, etc.)
"""
from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from ..database import get_db
from ..services.integration_service import integration_service
from ..models import DigitalTwin
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/integrations", tags=["Integrations"])

class ChatRequest(BaseModel):
    message: str
    customer_name: Optional[str] = "Visitor"
    session_id: Optional[str] = None

@router.post("/{twin_id}/chat")
async def public_chat(
    twin_id: int,
    request: ChatRequest,
    db: Session = Depends(get_db)
):
    """
    Public endpoint for web widgets to chat with a Digital Twin.
    No auth required for the customer.
    """
    result = await integration_service.process_public_message(
        db=db,
        twin_id=twin_id,
        message=request.message,
        customer_name=request.customer_name,
        session_id=request.session_id
    )
    
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
        
    return result

@router.post("/whatsapp/webhook")
async def whatsapp_webhook(
    data: dict = Body(...),
    db: Session = Depends(get_db)
):
    """
    Placeholder for WhatsApp/Twilio Webhook.
    Logic would parse incoming message, find the twin based on the phone number, 
    and call integration_service.
    """
    # Logic for parsing WhatsApp data goes here
    return {"status": "received"}

from fastapi.responses import Response

@router.get("/{twin_id}/widget.js")
async def get_widget_js(twin_id: int, db: Session = Depends(get_db)):
    """
    Returns the javascript snippet to inject the Digital Twin chat widget into any website.
    """
    # Fetch twin name for personalization
    twin = db.query(DigitalTwin).filter(DigitalTwin.id == twin_id).first()
    twin_name = twin.name if twin else "AI Assistant"
    
    return Response(content=f"""
(function() {{
    const twinId = {twin_id};
    // Auto-detect API URL based on script location
    const scriptTag = document.currentScript;
    const scriptUrl = scriptTag ? scriptTag.src : '';
    const apiUrl = scriptUrl.split('/integrations/')[0];

    // Inject CSS
    const style = document.createElement('style');
    style.innerHTML = `
        #dt-widget-container {{
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 999999;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }}
        #dt-chat-button {{
            width: 60px;
            height: 60px;
            border-radius: 30px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(102,126,234,0.4);
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            border: none;
            outline: none;
        }}
        #dt-chat-button:hover {{
            transform: scale(1.1) rotate(5deg);
            box-shadow: 0 8px 25px rgba(102,126,234,0.5);
        }}
        #dt-chat-window {{
            display: none;
            position: absolute;
            bottom: 80px;
            right: 0;
            width: 380px;
            height: 580px;
            background: white;
            border-radius: 20px;
            box-shadow: 0 15px 50px rgba(0,0,0,0.2);
            flex-direction: column;
            overflow: hidden;
            border: 1px solid rgba(0,0,0,0.05);
            transform-origin: bottom right;
            transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s;
            opacity: 0;
        }}
        #dt-chat-window.open {{
            display: flex;
            opacity: 1;
            transform: scale(1);
        }}
        #dt-chat-header {{
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            font-weight: 600;
            font-size: 17px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }}
        #dt-header-info {{
            display: flex;
            align-items: center;
            gap: 12px;
        }}
        #dt-header-dot {{
            width: 10px;
            height: 10px;
            background: #4ade80;
            border-radius: 50%;
            box-shadow: 0 0 8px #4ade80;
            animation: dt-pulse 2s infinite;
        }}
        @keyframes dt-pulse {{
            0%, 100% {{ transform: scale(1); opacity: 1; }}
            50% {{ transform: scale(1.2); opacity: 0.7; }}
        }}
        #dt-close-button {{
            cursor: pointer;
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            transition: background 0.2s;
        }}
        #dt-close-button:hover {{ background: rgba(255,255,255,0.3); }}
        #dt-chat-messages {{
            flex: 1;
            padding: 20px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 12px;
            background: #fcfcfd;
        }}
        .dt-message {{
            max-width: 85%;
            padding: 12px 16px;
            border-radius: 18px;
            font-size: 14.5px;
            line-height: 1.5;
            white-space: pre-line;
            box-shadow: 0 2px 5px rgba(0,0,0,0.02);
            animation: dt-fade-in 0.3s ease;
        }}
        @keyframes dt-fade-in {{
            from {{ opacity: 0; transform: translateY(10px); }}
            to {{ opacity: 1; transform: translateY(0); }}
        }}
        .dt-message.user {{
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            align-self: flex-end;
            border-bottom-right-radius: 4px;
        }}
        .dt-message.twin {{
            background: white;
            color: #1f2937;
            align-self: flex-start;
            border-bottom-left-radius: 4px;
            border: 1px solid #f3f4f6;
        }}
        #dt-quick-replies {{
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            padding: 0 20px 15px;
            background: #fcfcfd;
        }}
        .dt-quick-btn {{
            background: white;
            border: 1.5px solid #e5e7eb;
            border-radius: 20px;
            padding: 8px 16px;
            font-size: 13px;
            cursor: pointer;
            transition: all 0.2s;
            color: #4b5563;
            font-weight: 500;
        }}
        .dt-quick-btn:hover {{
            background: #f3f4f6;
            border-color: #667eea;
            color: #667eea;
            transform: translateY(-2px);
        }}
        #dt-typing {{
            display: none;
            align-self: flex-start;
            padding: 12px 16px;
            background: white;
            border: 1px solid #f3f4f6;
            border-radius: 18px;
            border-bottom-left-radius: 4px;
        }}
        .dt-typing-dots {{
            display: flex;
            gap: 5px;
        }}
        .dt-typing-dots span {{
            width: 7px;
            height: 7px;
            background: #cbd5e1;
            border-radius: 50%;
            animation: dt-bounce 1.4s infinite;
        }}
        .dt-typing-dots span:nth-child(2) {{ animation-delay: 0.2s; }}
        .dt-typing-dots span:nth-child(3) {{ animation-delay: 0.4s; }}
        @keyframes dt-bounce {{
            0%, 60%, 100% {{ transform: translateY(0); }}
            30% {{ transform: translateY(-8px); }}
        }}
        #dt-chat-input-container {{
            padding: 15px;
            background: white;
            border-top: 1px solid #f3f4f6;
            display: flex;
            gap: 10px;
            align-items: center;
        }}
        #dt-chat-input {{
            flex: 1;
            padding: 12px 18px;
            border: 1.5px solid #e5e7eb;
            border-radius: 25px;
            outline: none;
            font-size: 14.5px;
            transition: all 0.2s;
            background: #f9fafb;
        }}
        #dt-chat-input:focus {{
            border-color: #667eea;
            background: white;
            box-shadow: 0 0 0 3px rgba(102,126,234,0.1);
        }}
        #dt-send-button {{
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            width: 42px;
            height: 42px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
            flex-shrink: 0;
        }}
        #dt-send-button:hover {{ transform: scale(1.05); }}
        #dt-send-button:disabled {{ opacity: 0.5; filter: grayscale(1); }}
        #dt-mic-button {{
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: 1.5px solid #e5e7eb;
            background: white;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
            flex-shrink: 0;
        }}
        #dt-mic-button.recording {{
            background: #ef4444;
            border-color: #ef4444;
            animation: dt-mic-pulse 1.5s infinite;
        }}
        #dt-mic-button.recording svg {{ stroke: white; }}
        @keyframes dt-mic-pulse {{
            0%, 100% {{ box-shadow: 0 0 0 0 rgba(239,68,68,0.4); }}
            50% {{ box-shadow: 0 0 0 10px rgba(239,68,68,0); }}
        }}
        .dt-speak-btn {{
            background: rgba(102,126,234,0.1);
            border: none;
            cursor: pointer;
            padding: 5px;
            border-radius: 50%;
            margin-top: 6px;
            color: #667eea;
            display: inline-flex;
            transition: all 0.2s;
        }}
        .dt-speak-btn:hover {{ background: rgba(102,126,234,0.2); }}
        .dt-branding {{
            text-align: center;
            font-size: 10px;
            color: #9ca3af;
            padding-bottom: 10px;
            background: #fcfcfd;
        }}
        .dt-branding a {{ color: #764ba2; text-decoration: none; font-weight: 600; }}
    `;
    document.head.appendChild(style);

    // Inject HTML
    const container = document.createElement('div');
    container.id = 'dt-widget-container';
    container.innerHTML = `
        <div id="dt-chat-window">
            <div id="dt-chat-header">
                <div id="dt-header-info">
                    <div id="dt-header-dot"></div>
                    <span>{twin_name}</span>
                </div>
                <button id="dt-close-button">&times;</button>
            </div>
            <div id="dt-chat-messages">
                <div class="dt-message twin">Hi! 👋 I'm your AI assistant. How can I help you today?</div>
                <div id="dt-typing">
                    <div class="dt-typing-dots"><span></span><span></span><span></span></div>
                </div>
            </div>
            <div id="dt-quick-replies">
                <button class="dt-quick-btn" data-msg="Tell me about your business">🏢 About Us</button>
                <button class="dt-quick-btn" data-msg="What services do you offer?">🛠️ Services</button>
                <button class="dt-quick-btn" data-msg="How can I contact you?">📞 Contact</button>
            </div>
            <div class="dt-branding">Powered by <a href="#" target="_blank">Sahayak AI</a></div>
            <div id="dt-chat-input-container">
                <button id="dt-mic-button" title="Hold to speak">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
                </button>
                <input type="text" id="dt-chat-input" placeholder="Type a message..." />
                <button id="dt-send-button" disabled>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                </button>
            </div>
        </div>
        <button id="dt-chat-button">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
        </button>
    `;
    document.body.appendChild(container);

    // Logic
    let isOpen = false;
    let sessionId = 'sess_' + Math.random().toString(36).substring(7);

    const button = document.getElementById('dt-chat-button');
    const windowEl = document.getElementById('dt-chat-window');
    const closeBtn = document.getElementById('dt-close-button');
    const input = document.getElementById('dt-chat-input');
    const sendBtn = document.getElementById('dt-send-button');
    const messagesEl = document.getElementById('dt-chat-messages');
    const typingEl = document.getElementById('dt-typing');
    const quickRepliesEl = document.getElementById('dt-quick-replies');

    const toggleChat = () => {{
        isOpen = !isOpen;
        if (isOpen) {{
            windowEl.style.display = 'flex';
            setTimeout(() => windowEl.classList.add('open'), 10);
            input.focus();
        }} else {{
            windowEl.classList.remove('open');
            setTimeout(() => windowEl.style.display = 'none', 300);
        }}
    }};

    button.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', toggleChat);

    input.addEventListener('input', () => {{
        sendBtn.disabled = !input.value.trim();
    }});

    const addMessage = (text, sender) => {{
        const msgDiv = document.createElement('div');
        msgDiv.className = `dt-message ${{sender}}`;
        msgDiv.textContent = text;
        
        if (sender === 'twin') {{
            const speakBtn = document.createElement('button');
            speakBtn.className = 'dt-speak-btn';
            speakBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>';
            speakBtn.title = 'Listen';
            speakBtn.onclick = () => {{ speakText(text, speakBtn); }};
            msgDiv.appendChild(speakBtn);
        }}
        
        messagesEl.insertBefore(msgDiv, typingEl);
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }};

    const speakText = (text, btn) => {{
        if ('speechSynthesis' in window) {{
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 1;
            utterance.lang = 'en-IN';
            btn.style.color = '#764ba2';
            utterance.onend = () => {{ btn.style.color = '#667eea'; }};
            window.speechSynthesis.speak(utterance);
        }}
    }};

    // Speech Recognition
    const micBtn = document.getElementById('dt-mic-button');
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {{
        const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRec();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-IN';

        recognition.onresult = (event) => {{
            const transcript = Array.from(event.results).map(result => result[0].transcript).join('');
            input.value = transcript;
            sendBtn.disabled = !transcript.trim();
            if (event.results[0].isFinal) {{
                micBtn.classList.remove('recording');
                sendMessage(transcript);
            }}
        }};
        
        recognition.onerror = () => micBtn.classList.remove('recording');
        recognition.onend = () => micBtn.classList.remove('recording');

        micBtn.addEventListener('click', () => {{
            if (micBtn.classList.contains('recording')) {{
                recognition.stop();
            }} else {{
                input.value = '';
                recognition.start();
                micBtn.classList.add('recording');
            }}
        }});
    }} else {{
        micBtn.style.display = 'none';
    }}

    const sendMessage = async (text) => {{
        const msg = text || input.value.trim();
        if (!msg) return;

        addMessage(msg, 'user');
        input.value = '';
        sendBtn.disabled = true;
        input.disabled = true;
        quickRepliesEl.style.display = 'none';
        
        typingEl.style.display = 'block';
        messagesEl.scrollTop = messagesEl.scrollHeight;

        try {{
            const response = await fetch(`${{apiUrl}}/integrations/${{twinId}}/chat`, {{
                method: 'POST',
                headers: {{ 'Content-Type': 'application/json' }},
                body: JSON.stringify({{ message: msg, session_id: sessionId }})
            }});
            const data = await response.json();
            typingEl.style.display = 'none';
            
            if (response.ok && data.response) {{
                addMessage(data.response, 'twin');
            }} else {{
                addMessage('Something went wrong. Please try again.', 'twin');
            }}
        }} catch (error) {{
            typingEl.style.display = 'none';
            addMessage('Connection error. Please check your internet.', 'twin');
        }} finally {{
            input.disabled = false;
            sendBtn.disabled = !input.value.trim();
            input.focus();
        }}
    }};

    sendBtn.addEventListener('click', () => sendMessage());
    input.addEventListener('keypress', (e) => {{ if (e.key === 'Enter') sendMessage(); }});

    document.querySelectorAll('.dt-quick-btn').forEach(btn => {{
        btn.addEventListener('click', () => sendMessage(btn.getAttribute('data-msg')));
    }});
}})();
    """, media_type="application/javascript")

@router.get("/test-voice")
def test_voice_route():
    return {"status": "voice integration active"}

# Route for Voice AI Widget script injection
@router.get("/{twin_id}/voice-widget.js")
async def get_voice_widget_js(twin_id: int, db: Session = Depends(get_db)):
    """
    Returns the javascript snippet to inject the Voice AI "Call" button into any website.
    """
    twin = db.query(DigitalTwin).filter(DigitalTwin.id == twin_id).first()
    twin_name = twin.name if twin else "AI Voice"
    
    return Response(content=f"""
(function() {{
    const twinId = {twin_id};
    const twinName = "{twin_name}";
    const scriptTag = document.currentScript;
    const scriptUrl = scriptTag ? scriptTag.src : '';
    const baseUrl = scriptUrl.split('/api/integrations/')[0];
    
    // Frontend URL - For production, this should be your Vercel URL
    const frontendUrl = baseUrl.replace(':8000', ':3000'); 

    // Inject CSS
    const style = document.createElement('style');
    style.innerHTML = `
        #ai-voice-widget {{
            position: fixed;
            bottom: 90px;
            right: 20px;
            z-index: 999999;
        }}
        #ai-voice-button {{
            width: 60px;
            height: 60px;
            border-radius: 30px;
            background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(79, 70, 229, 0.4);
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            border: none;
            outline: none;
            font-size: 24px;
        }}
        #ai-voice-button:hover {{
            transform: scale(1.1) rotate(-5deg);
            box-shadow: 0 6px 25px rgba(79, 70, 229, 0.6);
        }}
        #ai-voice-tooltip {{
            position: absolute;
            right: 70px;
            top: 50%;
            transform: translateY(-50%);
            background: #1e293b;
            color: white;
            padding: 8px 12px;
            border-radius: 8px;
            font-size: 14px;
            white-space: nowrap;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s;
            font-family: sans-serif;
        }}
        #ai-voice-widget:hover #ai-voice-tooltip {{
            opacity: 1;
            visibility: visible;
            right: 80px;
        }}
    `;
    document.head.appendChild(style);

    // Create Widget
    const container = document.createElement('div');
    container.id = 'ai-voice-widget';
    container.innerHTML = `
        <div id="ai-voice-tooltip">Call ${twinName}</div>
        <button id="ai-voice-button">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l2.18-1.28a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
        </button>
    `;
    document.body.appendChild(container);

    // Click Event
    document.getElementById('ai-voice-button').onclick = function() {{
        const width = 450;
        const height = 700;
        const left = (window.innerWidth / 2) - (width / 2);
        const top = (window.innerHeight / 2) - (height / 2);
        
        window.open(
            `${{frontendUrl}}/voice-agent?twin_id=${{twinId}}&widget=true`,
            'AIVoiceAgent',
            `width=${{width}},height=${{height}},top=${{top}},left=${{left}},status=no,menubar=no,toolbar=no`
        );
    }};
}})();
""", media_type="application/javascript")
