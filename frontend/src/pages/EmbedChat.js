import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Box, TextField, IconButton, Typography, Avatar, Paper } from '@mui/material';
import { Send, Bot, User, X } from 'lucide-react';
import axios from 'axios';

const EmbedChat = () => {
  const { twinId } = useParams();
  const [messages, setMessages] = useState([
    { text: "Hi! I'm your AI assistant. How can I help you today?", isBot: true }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { text: userMessage, isBot: false }]);
    setInput('');
    setLoading(true);

    try {
      // Use the actual chat endpoint
      const response = await axios.post(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/chat`, {
        twin_id: twinId,
        message: userMessage,
        // Since it's an embedded widget without login, we can pass a generic or anonymous user ID
        user_id: "anonymous_embedded_user", 
        platform: 'web'
      });
      
      setMessages(prev => [...prev, { text: response.data.reply || response.data.response || "Sorry, I couldn't process that.", isBot: true }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { text: "Sorry, I'm having trouble connecting right now.", isBot: true }]);
    } finally {
      setLoading(false);
    }
  };

  const closeWidget = () => {
    // Send a message to the parent window to close the iframe
    window.parent.postMessage({ type: 'CLOSE_WIDGET' }, '*');
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh', 
      backgroundColor: '#f8fafc',
      fontFamily: 'Inter, sans-serif'
    }}>
      {/* Header */}
      <Box sx={{ 
        p: 2, 
        bgcolor: '#0f172a', 
        color: 'white', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar sx={{ bgcolor: '#3b82f6', width: 32, height: 32 }}>
            <Bot size={20} />
          </Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight="600" sx={{ lineHeight: 1.2 }}>AI Assistant</Typography>
            <Typography variant="caption" sx={{ color: '#94a3b8' }}>Typically replies instantly</Typography>
          </Box>
        </Box>
        <IconButton size="small" sx={{ color: '#94a3b8' }} onClick={closeWidget}>
          <X size={20} />
        </IconButton>
      </Box>

      {/* Chat Area */}
      <Box sx={{ flex: 1, overflowY: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {messages.map((msg, index) => (
          <Box key={index} sx={{ 
            display: 'flex', 
            justifyContent: msg.isBot ? 'flex-start' : 'flex-end',
            alignItems: 'flex-end',
            gap: 1
          }}>
            {msg.isBot && <Avatar sx={{ width: 24, height: 24, bgcolor: '#3b82f6' }}><Bot size={14} /></Avatar>}
            <Paper elevation={0} sx={{
              p: 1.5,
              maxWidth: '75%',
              borderRadius: 2,
              borderBottomLeftRadius: msg.isBot ? 0 : 8,
              borderBottomRightRadius: msg.isBot ? 8 : 0,
              bgcolor: msg.isBot ? 'white' : '#3b82f6',
              color: msg.isBot ? '#0f172a' : 'white',
              boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
              wordBreak: 'break-word'
            }}>
              <Typography variant="body2">{msg.text}</Typography>
            </Paper>
          </Box>
        ))}
        
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-end', gap: 1 }}>
            <Avatar sx={{ width: 24, height: 24, bgcolor: '#3b82f6' }}><Bot size={14} /></Avatar>
            <Paper elevation={0} sx={{ p: 1.5, borderRadius: 2, borderBottomLeftRadius: 0, bgcolor: 'white' }}>
              <Typography variant="body2" sx={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <span className="dot-typing"></span> Typing...
              </Typography>
            </Paper>
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input Area */}
      <Box sx={{ p: 2, bgcolor: 'white', borderTop: '1px solid #e2e8f0' }}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '20px',
                bgcolor: '#f8fafc'
              }
            }}
          />
          <IconButton 
            color="primary" 
            onClick={handleSend}
            disabled={!input.trim() || loading}
            sx={{ bgcolor: '#3b82f6', color: 'white', '&:hover': { bgcolor: '#2563eb' } }}
          >
            <Send size={18} />
          </IconButton>
        </Box>
        <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 1, color: '#cbd5e1', fontSize: '10px' }}>
          Powered by AI Digital Twin
        </Typography>
      </Box>
    </Box>
  );
};

export default EmbedChat;
