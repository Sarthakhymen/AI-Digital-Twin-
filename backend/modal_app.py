"""
Modal.com App Definition
Deploy with: modal deploy modal_app.py
"""
import modal
from app.ai.conversation_service import stub as conversation_stub
from app.ai.training_service import stub as training_stub

# Combine stubs
app = modal.Stub("digital-twin-creator")
app.add(conversation_stub)
app.add(training_stub)

if __name__ == "__main__":
    app.serve()
