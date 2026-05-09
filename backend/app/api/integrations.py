"""
Public Integration API Routes (Web Widget, Webhooks, etc.)
"""
from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from ..database import get_db
from ..services.integration_service import integration_service
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
async def get_widget_js(twin_id: int):
    """
    Returns the javascript snippet to inject the Digital Twin chat widget into any website.
    """
    return Response(content=f"""
(function() {{
    const twinId = {twin_id};
    const apiUrl = 'https://ai-digital-twin-2le9.onrender.com/api/v1';

    // Inject CSS
    const style = document.createElement('style');
    style.innerHTML = `
        #dt-widget-container {{
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 999999;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
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
            box-shadow: 0 4px 15px rgba(102,126,234,0.4);
            transition: transform 0.2s, box-shadow 0.2s;
            border: none;
            outline: none;
        }}
        #dt-chat-button:hover {{
            transform: scale(1.1);
            box-shadow: 0 6px 20px rgba(102,126,234,0.5);
        }}
        #dt-chat-window {{
            display: none;
            position: absolute;
            bottom: 80px;
            right: 0;
            width: 370px;
            height: 520px;
            background: white;
            border-radius: 16px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.15);
            flex-direction: column;
            overflow: hidden;
            border: 1px solid #e5e7eb;
        }}
        #dt-chat-header {{
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 16px 20px;
            font-weight: 600;
            font-size: 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }}
        #dt-header-info {{
            display: flex;
            align-items: center;
            gap: 10px;
        }}
        #dt-header-dot {{
            width: 8px;
            height: 8px;
            background: #4ade80;
            border-radius: 50%;
            animation: dt-pulse 2s infinite;
        }}
        @keyframes dt-pulse {{
            0%, 100% {{ opacity: 1; }}
            50% {{ opacity: 0.5; }}
        }}
        #dt-close-button {{
            cursor: pointer;
            background: none;
            border: none;
            color: white;
            font-size: 22px;
            line-height: 1;
        }}
        #dt-chat-messages {{
            flex: 1;
            padding: 16px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 10px;
            background: #f9fafb;
        }}
        .dt-message {{
            max-width: 82%;
            padding: 10px 14px;
            border-radius: 16px;
            font-size: 14px;
            line-height: 1.5;
            white-space: pre-line;
        }}
        .dt-message.user {{
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            align-self: flex-end;
            border-bottom-right-radius: 4px;
        }}
        .dt-message.twin {{
            background: white;
            color: #111827;
            align-self: flex-start;
            border-bottom-left-radius: 4px;
            border: 1px solid #e5e7eb;
        }}
        #dt-quick-replies {{
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            padding: 0 16px 12px;
            background: #f9fafb;
        }}
        .dt-quick-btn {{
            background: white;
            border: 1px solid #d1d5db;
            border-radius: 20px;
            padding: 6px 14px;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.2s;
            color: #374151;
            white-space: nowrap;
        }}
        .dt-quick-btn:hover {{
            background: #667eea;
            color: white;
            border-color: #667eea;
        }}
        #dt-typing {{
            display: none;
            align-self: flex-start;
            padding: 10px 14px;
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 16px;
            border-bottom-left-radius: 4px;
        }}
        .dt-typing-dots {{
            display: flex;
            gap: 4px;
        }}
        .dt-typing-dots span {{
            width: 6px;
            height: 6px;
            background: #9ca3af;
            border-radius: 50%;
            animation: dt-bounce 1.4s infinite;
        }}
        .dt-typing-dots span:nth-child(2) {{ animation-delay: 0.2s; }}
        .dt-typing-dots span:nth-child(3) {{ animation-delay: 0.4s; }}
        @keyframes dt-bounce {{
            0%, 60%, 100% {{ transform: translateY(0); }}
            30% {{ transform: translateY(-6px); }}
        }}
        #dt-chat-input-container {{
            padding: 12px;
            background: white;
            border-top: 1px solid #e5e7eb;
            display: flex;
            gap: 8px;
        }}
        #dt-chat-input {{
            flex: 1;
            padding: 10px 16px;
            border: 1px solid #d1d5db;
            border-radius: 24px;
            outline: none;
            font-size: 14px;
            transition: border-color 0.2s;
        }}
        #dt-chat-input:focus {{
            border-color: #667eea;
            box-shadow: 0 0 0 2px rgba(102,126,234,0.15);
        }}
        #dt-send-button {{
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 24px;
            padding: 0 18px;
            cursor: pointer;
            font-weight: 600;
            font-size: 14px;
            transition: opacity 0.2s;
        }}
        #dt-send-button:disabled {{
            opacity: 0.5;
            cursor: not-allowed;
        }}
        #dt-mic-button {{
            width: 38px;
            height: 38px;
            border-radius: 50%;
            border: 1px solid #d1d5db;
            background: white;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
            flex-shrink: 0;
        }}
        #dt-mic-button:hover {{ background: #f3f4f6; }}
        #dt-mic-button.recording {{
            background: #ef4444;
            border-color: #ef4444;
            animation: dt-mic-pulse 1s infinite;
        }}
        #dt-mic-button.recording svg {{ stroke: white; }}
        @keyframes dt-mic-pulse {{
            0%, 100% {{ box-shadow: 0 0 0 0 rgba(239,68,68,0.4); }}
            50% {{ box-shadow: 0 0 0 8px rgba(239,68,68,0); }}
        }}
        .dt-speak-btn {{
            background: none;
            border: none;
            cursor: pointer;
            padding: 2px;
            margin-top: 4px;
            opacity: 0.5;
            transition: opacity 0.2s;
            display: inline-flex;
        }}
        .dt-speak-btn:hover {{ opacity: 1; }}
        .dt-speak-btn.speaking {{ opacity: 1; color: #667eea; }}
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
                    <span>AI Assistant</span>
                </div>
                <button id="dt-close-button">&times;</button>
            </div>
            <div id="dt-chat-messages">
                <div class="dt-message twin">Hi! 👋 How can I help you today?</div>
                <div id="dt-typing">
                    <div class="dt-typing-dots"><span></span><span></span><span></span></div>
                </div>
            </div>
            <div id="dt-quick-replies">
                <button class="dt-quick-btn" data-msg="Show me the menu">📋 Menu</button>
                <button class="dt-quick-btn" data-msg="What are your best dishes?">⭐ Best Sellers</button>
                <button class="dt-quick-btn" data-msg="What are your prices?">💰 Pricing</button>
                <button class="dt-quick-btn" data-msg="What is your address?">📍 Address</button>
                <button class="dt-quick-btn" data-msg="What are your timings?">⏰ Hours</button>
                <button class="dt-quick-btn" data-msg="Do you deliver?">🛵 Delivery</button>
            </div>
            <div id="dt-chat-input-container">
                <button id="dt-mic-button" title="Hold to speak">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
                </button>
                <input type="text" id="dt-chat-input" placeholder="Type or speak..." />
                <button id="dt-send-button">Send</button>
            </div>
        </div>
        <button id="dt-chat-button">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
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
        windowEl.style.display = isOpen ? 'flex' : 'none';
        if (isOpen) input.focus();
    }};

    button.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', toggleChat);

    const addMessage = (text, sender) => {{
        const msgDiv = document.createElement('div');
        msgDiv.className = `dt-message ${{sender}}`;
        msgDiv.textContent = text;
        // Add speaker icon to AI messages
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

    // Text-to-Speech
    const speakText = (text, btn) => {{
        if ('speechSynthesis' in window) {{
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 1;
            utterance.pitch = 1;
            utterance.lang = 'en-IN';
            btn.classList.add('speaking');
            utterance.onend = () => {{ btn.classList.remove('speaking'); }};
            window.speechSynthesis.speak(utterance);
        }}
    }};

    // Speech-to-Text (Mic)
    const micBtn = document.getElementById('dt-mic-button');
    let recognition = null;
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {{
        const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRec();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-IN';

        recognition.onresult = (event) => {{
            const transcript = event.results[0][0].transcript;
            input.value = transcript;
            micBtn.classList.remove('recording');
            sendMessage(transcript);
        }};
        recognition.onerror = () => {{ micBtn.classList.remove('recording'); }};
        recognition.onend = () => {{ micBtn.classList.remove('recording'); }};

        micBtn.addEventListener('click', () => {{
            if (micBtn.classList.contains('recording')) {{
                recognition.stop();
            }} else {{
                recognition.start();
                micBtn.classList.add('recording');
            }}
        }});
    }} else {{
        micBtn.style.display = 'none';
    }}

    const showTyping = () => {{
        typingEl.style.display = 'block';
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }};

    const hideTyping = () => {{
        typingEl.style.display = 'none';
    }};

    const sendMessage = async (text) => {{
        if (!text) text = input.value.trim();
        if (!text) return;

        addMessage(text, 'user');
        input.value = '';
        input.disabled = true;
        sendBtn.disabled = true;
        quickRepliesEl.style.display = 'none';
        showTyping();

        try {{
            const response = await fetch(`${{apiUrl}}/integrations/${{twinId}}/chat`, {{
                method: 'POST',
                headers: {{ 'Content-Type': 'application/json' }},
                body: JSON.stringify({{ message: text, session_id: sessionId }})
            }});
            const data = await response.json();
            hideTyping();
            if (response.ok && data.response) {{
                addMessage(data.response, 'twin');
            }} else {{
                addMessage('Sorry, having trouble connecting.', 'twin');
            }}
        }} catch (error) {{
            hideTyping();
            addMessage('Error connecting to server.', 'twin');
        }} finally {{
            input.disabled = false;
            sendBtn.disabled = false;
            input.focus();
        }}
    }};

    sendBtn.addEventListener('click', () => sendMessage());
    input.addEventListener('keypress', (e) => {{
        if (e.key === 'Enter') sendMessage();
    }});

    document.querySelectorAll('.dt-quick-btn').forEach(btn => {{
        btn.addEventListener('click', () => {{
            sendMessage(btn.getAttribute('data-msg'));
        }});
    }});
}})();
    """, media_type="application/javascript")
