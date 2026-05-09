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
    // Use the production URL of the API
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
            background: #2563eb;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            transition: transform 0.2s;
            border: none;
            outline: none;
        }}
        #dt-chat-button:hover {{
            transform: scale(1.05);
        }}
        #dt-chat-window {{
            display: none;
            position: absolute;
            bottom: 80px;
            right: 0;
            width: 350px;
            height: 500px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.15);
            flex-direction: column;
            overflow: hidden;
            border: 1px solid #e5e7eb;
        }}
        #dt-chat-header {{
            background: #2563eb;
            color: white;
            padding: 16px;
            font-weight: 600;
            font-size: 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }}
        #dt-close-button {{
            cursor: pointer;
            background: none;
            border: none;
            color: white;
            font-size: 20px;
        }}
        #dt-chat-messages {{
            flex: 1;
            padding: 16px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 12px;
            background: #f9fafb;
        }}
        .dt-message {{
            max-width: 80%;
            padding: 10px 14px;
            border-radius: 12px;
            font-size: 14px;
            line-height: 1.4;
        }}
        .dt-message.user {{
            background: #2563eb;
            color: white;
            align-self: flex-end;
            border-bottom-right-radius: 4px;
        }}
        .dt-message.twin {{
            background: #e5e7eb;
            color: #111827;
            align-self: flex-start;
            border-bottom-left-radius: 4px;
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
            padding: 10px;
            border: 1px solid #d1d5db;
            border-radius: 20px;
            outline: none;
            font-size: 14px;
        }}
        #dt-chat-input:focus {{
            border-color: #2563eb;
        }}
        #dt-send-button {{
            background: #2563eb;
            color: white;
            border: none;
            border-radius: 20px;
            padding: 0 16px;
            cursor: pointer;
            font-weight: 600;
        }}
        #dt-send-button:disabled {{
            background: #9ca3af;
        }}
    `;
    document.head.appendChild(style);

    // Inject HTML
    const container = document.createElement('div');
    container.id = 'dt-widget-container';
    container.innerHTML = `
        <div id="dt-chat-window">
            <div id="dt-chat-header">
                <span>AI Assistant</span>
                <button id="dt-close-button">&times;</button>
            </div>
            <div id="dt-chat-messages">
                <div class="dt-message twin">Hi! How can I help you today?</div>
            </div>
            <div id="dt-chat-input-container">
                <input type="text" id="dt-chat-input" placeholder="Type your message..." />
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
        messagesEl.appendChild(msgDiv);
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }};

    const sendMessage = async () => {{
        const text = input.value.trim();
        if (!text) return;

        addMessage(text, 'user');
        input.value = '';
        input.disabled = true;
        sendBtn.disabled = true;

        try {{
            const response = await fetch(`${{apiUrl}}/integrations/${{twinId}}/chat`, {{
                method: 'POST',
                headers: {{ 'Content-Type': 'application/json' }},
                body: JSON.stringify({{ message: text, session_id: sessionId }})
            }});
            const data = await response.json();
            
            if (response.ok && data.response) {{
                addMessage(data.response, 'twin');
            }} else {{
                addMessage('Sorry, I am having trouble connecting right now.', 'twin');
            }}
        }} catch (error) {{
            console.error('Widget error:', error);
            addMessage('Error connecting to the AI server.', 'twin');
        }} finally {{
            input.disabled = false;
            sendBtn.disabled = false;
            input.focus();
        }}
    }};

    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keypress', (e) => {{
        if (e.key === 'Enter') sendMessage();
    }});
}})();
    """, media_type="application/javascript")
