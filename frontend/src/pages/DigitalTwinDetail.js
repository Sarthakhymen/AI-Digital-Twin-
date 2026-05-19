import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box, Typography, Paper, Grid, Chip, Button, Card, CardContent,
  List, ListItem, ListItemText, Divider, LinearProgress, Alert,
  IconButton, Snackbar, ToggleButton, ToggleButtonGroup
} from '@mui/material';
import { ArrowBack, PlayArrow, Pause, Edit, CloudUpload, Delete, Description, ContentCopy, Code, Public, FormatAlignLeft, FormatAlignRight } from '@mui/icons-material';
import api from '../services/api';
import WhatsAppScanner from '../components/WhatsAppScanner';
import { useAuth } from '../contexts/AuthContext';
import { Lock } from '@mui/icons-material';


const DigitalTwinDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userFeatures } = useAuth();
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);
  const voiceInputRef = useRef(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [widgetPosition, setWidgetPosition] = useState('right');

  // Feature gating helper
  const FeatureLock = ({ feature, children, title }) => {
    const isLocked = !userFeatures || !userFeatures[feature];
    
    if (!isLocked) return children;

    return (
      <Box sx={{ position: 'relative', mt: 3 }}>
        <Box sx={{ filter: 'blur(4px)', pointerEvents: 'none', opacity: 0.6 }}>
          {children}
        </Box>
        <Box 
          sx={{ 
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            bgcolor: 'rgba(15, 23, 42, 0.4)', borderRadius: 3, zIndex: 10,
            backdropFilter: 'blur(2px)', border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <Box 
            sx={{ 
              width: 50, height: 50, borderRadius: '50%', bgcolor: 'rgba(225, 29, 72, 0.2)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2,
              border: '1px solid rgba(225, 29, 72, 0.4)'
            }}
          >
            <Lock sx={{ color: '#e11d48' }} />
          </Box>
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>{title} Locked</Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2, textAlign: 'center', px: 3 }}>
            This is a premium feature. Upgrade to Business Pro to unlock.
          </Typography>
          <Button 
            variant="contained" 
            size="small"
            disabled
            sx={{ 
              bgcolor: '#475569',
              color: '#cbd5e1',
              textTransform: 'none', fontWeight: 600, borderRadius: '8px',
              '&.Mui-disabled': {
                bgcolor: '#334155',
                color: '#94a3b8'
              }
            }}
          >
            Business Pro (Coming Soon)
          </Button>
        </Box>
      </Box>
    );
  };

  const { data: twin, isLoading } = useQuery({
    queryKey: ['digital-twin', id],
    queryFn: () => api.get(`/digital-twins/${id}`).then(res => res.data),
  });

  const { data: documents = [], isLoading: docsLoading } = useQuery({
    queryKey: ['knowledge-docs', id],
    queryFn: () => api.get(`/knowledge/${id}/documents`).then(res => res.data),
  });

  const activateMutation = useMutation({
    mutationFn: () => api.post(`/digital-twins/${id}/activate`),
    onSuccess: () => queryClient.invalidateQueries(['digital-twin', id]),
  });

  const deleteMutation = useMutation({
    mutationFn: (docId) => api.delete(`/knowledge/${id}/documents/${docId}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['knowledge-docs', id]);
      setSnackbar({ open: true, message: 'Document deleted!', severity: 'success' });
    },
  });

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploadStatus('uploading');
    try {
      const response = await api.post(`/knowledge/${id}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUploadStatus('success');
      setSnackbar({ open: true, message: `✅ ${response.data.message} (${response.data.chunks_created} chunks created)`, severity: 'success' });
      queryClient.invalidateQueries(['knowledge-docs', id]);
    } catch (error) {
      setUploadStatus('error');
      setSnackbar({ open: true, message: `❌ Upload failed: ${error.response?.data?.detail || error.message}`, severity: 'error' });
    }
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
    setTimeout(() => setUploadStatus(null), 3000);
  };

  const handleVoiceUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploadStatus('voice_uploading');
    try {
      await api.post(`/digital-twins/${id}/voice-samples`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUploadStatus('voice_success');
      setSnackbar({ open: true, message: 'Voice sample uploaded successfully!', severity: 'success' });
      queryClient.invalidateQueries(['digital-twin', id]);
    } catch (error) {
      setUploadStatus('voice_error');
      setSnackbar({ open: true, message: `❌ Upload failed: ${error.response?.data?.detail || error.message}`, severity: 'error' });
    }
    // Reset file input
    if (voiceInputRef.current) voiceInputRef.current.value = '';
    setTimeout(() => setUploadStatus(null), 3000);
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'training': return 'warning';
      case 'paused': return 'default';
      default: return 'default';
    }
  };

  if (isLoading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200, color: 'rgba(255,255,255,0.6)' }}>
      <Typography variant="h6" sx={{ fontFamily: '"Outfit", sans-serif' }}>Loading twin...</Typography>
    </Box>
  );
  if (!twin) return <Typography sx={{ color: 'rgba(255,255,255,0.6)', p: 4 }}>Digital twin not found</Typography>;

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto' }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/')}
        sx={{ mb: 3, color: 'rgba(255,255,255,0.7)', textTransform: 'none', '&:hover': { color: '#fff', bgcolor: 'rgba(255,255,255,0.05)' } }}
      >
        Back to Dashboard
      </Button>

      {/* Main Twin Info Card */}
      <Card sx={{
        background: '#0a0a0f',
        border: '1px solid rgba(255,255,255,0.06)',
        boxShadow: '0 4px 24px -4px rgba(0, 0, 0, 0.3)',
        borderRadius: '16px',
        color: '#fff',
        mb: 4,
      }}>
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h4" sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 700, color: '#fff' }}>{twin.name}</Typography>
              <Chip
                label={twin.status}
                size="small"
                sx={{
                  mt: 1,
                  bgcolor: twin.status === 'active' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                  color: twin.status === 'active' ? '#34D399' : '#FBBF24',
                  border: `1px solid ${twin.status === 'active' ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'}`,
                  fontFamily: '"Outfit", sans-serif',
                  fontWeight: 600,
                }}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                startIcon={<Edit />}
                sx={{ color: 'rgba(255,255,255,0.6)', textTransform: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', px: 2 }}
              >
                Edit
              </Button>
              {(twin.status === 'trained' || twin.status === 'training') && (
                <Button
                  variant="contained"
                  startIcon={<PlayArrow />}
                  onClick={() => activateMutation.mutate()}
                  sx={{ background: '#ffffff', color: '#0a0a0f', textTransform: 'none', borderRadius: '10px', '&:hover': { background: '#e2e8f0' }, fontWeight: 600 }}
                >
                  Activate
                </Button>
              )}
              {twin.status === 'active' && (
                <Button
                  variant="outlined"
                  startIcon={<Pause />}
                  sx={{ color: '#FBBF24', borderColor: 'rgba(245,158,11,0.4)', textTransform: 'none', borderRadius: '10px' }}
                >
                  Pause
                </Button>
              )}
            </Box>
          </Box>

          <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.06)' }} />

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 600, mb: 2 }}>Description</Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>{twin.description || 'No description provided'}</Typography>

              <Typography variant="h6" sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 600, mt: 3, mb: 2 }}>Personality Profile</Typography>
              {twin.personality_profile ? (
                <List dense>
                  {Object.entries(twin.personality_profile).map(([key, value]) => (
                    <ListItem key={key} sx={{ px: 0 }}>
                      <ListItemText
                        primary={<Typography sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}>{key}</Typography>}
                        secondary={<Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>{JSON.stringify(value)}</Typography>}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography sx={{ color: 'rgba(255,255,255,0.5)' }}>No personality profile configured</Typography>
              )}
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 600, mb: 2 }}>Communication Style</Typography>
              {twin.communication_style ? (
                <Card sx={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', color: '#fff', boxShadow: 'none' }}>
                  <CardContent>
                    {Object.entries(twin.communication_style).map(([key, value]) => (
                      <Box key={key} sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" sx={{ color: '#8B5CF6', textTransform: 'capitalize', mb: 0.5 }}>{key}</Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', textTransform: 'capitalize' }}>{value}</Typography>
                        <Divider sx={{ mt: 1.5, borderColor: 'rgba(255,255,255,0.05)' }} />
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              ) : (
                <Typography sx={{ color: 'rgba(255,255,255,0.5)' }}>No communication style set</Typography>
              )}


            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 3, mb: 1.5 }}>
              <Typography variant="h6" sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 600 }}>Voice Samples</Typography>
              <Box>
                <input
                  type="file"
                  ref={voiceInputRef}
                  onChange={(e) => handleVoiceUpload(e)}
                  accept="audio/*"
                  style={{ display: 'none' }}
                />
                <Button
                  size="small"
                  startIcon={<CloudUpload />}
                  onClick={() => voiceInputRef.current?.click()}
                  disabled={uploadStatus === 'voice_uploading'}
                  sx={{
                    color: 'rgba(255,255,255,0.7)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    textTransform: 'none',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.2)' },
                    '&.Mui-disabled': { color: 'rgba(255,255,255,0.3)' }
                  }}
                >
                  {uploadStatus === 'voice_uploading' ? 'Uploading...' : 'Upload'}
                </Button>
              </Box>
            </Box>


              {twin.voice_samples && twin.voice_samples.length > 0 ? (
                <List dense sx={{ bgcolor: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  {twin.voice_samples.map((sample, index) => (
                    <ListItem
                      key={sample.id || index}
                      secondaryAction={
                        <IconButton edge="end" size="small" sx={{ color: 'rgba(255,255,255,0.6)', '&:hover': { color: '#6366F1' } }} onClick={() => {
                          const baseUrl = (process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api/v1').replace('/api/v1', '');
                          const audio = new Audio(`${baseUrl}${sample.url}`);
                          audio.play();
                        }}>
                          <PlayArrow fontSize="small" />
                        </IconButton>
                      }
                    >
                      <ListItemText
                        primary={<Typography sx={{ color: '#fff', fontSize: '0.875rem' }}>{sample.filename}</Typography>}
                        secondary={<Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>{`${(sample.size / 1024).toFixed(1)} KB • ${new Date(sample.uploaded_at).toLocaleDateString()}`}</Typography>}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography sx={{ color: 'rgba(255,255,255,0.5)' }}>No voice samples uploaded</Typography>
              )}

            <Divider sx={{ my: 3 }} />
            
            <Typography variant="h6" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Public fontSize="small" /> Integrations & Deployments
            </Typography>

            {/* Container 1: Free Trial Plan */}
            <Box sx={{ mt: 3, p: 3, borderRadius: 3, bgcolor: 'rgba(59, 130, 246, 0.04)', border: '1px solid rgba(59, 130, 246, 0.2)', position: 'relative' }}>
              <Box sx={{ position: 'absolute', top: -12, left: 16, bgcolor: '#020617', px: 1 }}>
                <Typography variant="caption" sx={{ color: '#3b82f6', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Free Trial Plan
                </Typography>
              </Box>

              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                <Code color="primary" /> Web Chat Widget
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Add this premium chat widget to your website. Simply copy and paste this script tag into your website's <code>&lt;head&gt;</code> section.
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1, display: 'block' }}>Widget Position</Typography>
                <ToggleButtonGroup
                  value={widgetPosition}
                  exclusive
                  onChange={(e, newPos) => { if (newPos) setWidgetPosition(newPos); }}
                  size="small"
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.05)',
                    '& .MuiToggleButton-root': { color: 'rgba(255,255,255,0.5)', borderColor: 'rgba(255,255,255,0.1)' },
                    '& .Mui-selected': { bgcolor: 'rgba(59, 130, 246, 0.2) !important', color: '#3b82f6 !important' }
                  }}
                >
                  <ToggleButton value="left"><FormatAlignLeft sx={{ mr: 1, fontSize: 18 }}/> Left</ToggleButton>
                  <ToggleButton value="right"><FormatAlignRight sx={{ mr: 1, fontSize: 18 }}/> Right</ToggleButton>
                </ToggleButtonGroup>
              </Box>
              
              <Paper 
                variant="outlined" 
                sx={{ 
                  p: 2, 
                  bgcolor: '#1e1e1e', 
                  color: '#d4d4d4',
                  fontFamily: '"Fira Code", monospace', 
                  fontSize: '12px',
                  position: 'relative',
                  borderRadius: 2,
                  overflow: 'hidden',
                  border: 'none',
                  mb: 2
                }}
              >
                <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                  <IconButton 
                    size="small" 
                    sx={{ color: '#aaa', '&:hover': { color: '#fff' } }}
                    onClick={() => {
                      const snippet = `<script src="${window.location.origin}/widget.js" data-twin-id="${id}" data-position="${widgetPosition}"></script>`;
                      navigator.clipboard.writeText(snippet);
                      setSnackbar({ open: true, message: 'Chat snippet copied!', severity: 'success' });
                    }}
                  >
                    <ContentCopy fontSize="small" />
                  </IconButton>
                </Box>
                <code style={{ wordBreak: 'break-all' }}>
                  {`<script src="${window.location.origin}/widget.js" data-twin-id="${id}" data-position="${widgetPosition}"></script>`}
                </code>
              </Paper>
            </Box>

            {/* Container 2: Standard Plan */}
            <Box sx={{ mt: 4, p: 3, borderRadius: 3, bgcolor: 'rgba(245, 158, 11, 0.04)', border: '1px solid rgba(245, 158, 11, 0.2)', position: 'relative' }}>
              <Box sx={{ position: 'absolute', top: -12, left: 16, bgcolor: '#020617', px: 1 }}>
                <Typography variant="caption" sx={{ color: '#f59e0b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Standard Plan
                </Typography>
              </Box>

              <FeatureLock feature="whatsapp" title="WhatsApp Basic">
                <Box sx={{ mt: 1 }}>
                  <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                    WhatsApp Connection (Basic)
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Allow your AI Twin to respond to basic customer inquiries on WhatsApp.
                  </Typography>
                  <WhatsAppScanner twinId={id} />
                </Box>
              </FeatureLock>
            </Box>

            {/* Container 3: Business Pro Plan */}
            <Box sx={{ mt: 4, p: 3, borderRadius: 3, bgcolor: 'rgba(225, 29, 72, 0.04)', border: '1px solid rgba(225, 29, 72, 0.2)', position: 'relative' }}>
              <Box sx={{ position: 'absolute', top: -12, left: 16, bgcolor: '#020617', px: 1 }}>
                <Typography variant="caption" sx={{ color: '#e11d48', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Business Pro Plan
                </Typography>
              </Box>

              <FeatureLock feature="voice_agent" title="Voice AI Agent & Advanced WhatsApp">
                <Box sx={{ mt: 1 }}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PlayArrow color="primary" /> AI Voice Call Widget
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Enable users to call your AI Twin directly. This adds a "Call" floating button to your site.
                  </Typography>
                  
                  <Paper 
                    variant="outlined" 
                    sx={{ 
                      p: 2, 
                      bgcolor: '#1e1e1e', 
                      color: '#d4d4d4',
                      fontFamily: '"Fira Code", monospace', 
                      fontSize: '12px',
                      position: 'relative',
                      borderRadius: 2,
                      overflow: 'hidden',
                      border: 'none',
                      mb: 2
                    }}
                  >
                    <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                      <IconButton 
                        size="small" 
                        sx={{ color: '#aaa', '&:hover': { color: '#fff' } }}
                        onClick={() => {
                          const snippet = `<script src="${process.env.REACT_APP_API_URL || 'https://ai-digital-twin-2le9.onrender.com/api/v1'}/integrations/${id}/voice-widget.js"></script>`;
                          navigator.clipboard.writeText(snippet);
                          setSnackbar({ open: true, message: 'Voice snippet copied!', severity: 'success' });
                        }}
                      >
                        <ContentCopy fontSize="small" />
                      </IconButton>
                    </Box>
                    <code style={{ wordBreak: 'break-all' }}>
                      {`<script src="${process.env.REACT_APP_API_URL || 'https://ai-digital-twin-2le9.onrender.com/api/v1'}/integrations/${id}/voice-widget.js"></script>`}
                    </code>
                  </Paper>
                  
                  <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.05)' }} />

                  <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#e11d48"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                    WhatsApp Integration (Advanced)
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Unlock advanced WhatsApp workflows like meeting scheduling and table bookings.
                  </Typography>
                </Box>
              </FeatureLock>
            </Box>

          </Grid>
        </Grid>
        </CardContent>
      </Card>


      {/* ========== KNOWLEDGE BASE SECTION ========== */}
      <Card sx={{ background: '#0a0a0f', border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 4px 24px -4px rgba(0, 0, 0, 0.3)', borderRadius: '16px', color: '#fff', mt: 4 }}>
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h5" sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 700, mb: 0.5 }}>📚 Knowledge Base</Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                Upload PDFs or text files to train your Digital Twin with business-specific knowledge.
              </Typography>
            </Box>
            <Box>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".pdf,.txt" style={{ display: 'none' }} />
              <Button
                variant="contained"
                startIcon={<CloudUpload />}
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadStatus === 'uploading'}
                sx={{
                  background: '#ffffff',
                  color: '#0a0a0f',
                  textTransform: 'none',
                  borderRadius: '10px',
                  fontFamily: '"Outfit", sans-serif',
                  fontWeight: 600,
                  '&:hover': { background: '#e2e8f0' },
                  '&.Mui-disabled': { background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.3)' }
                }}
              >
                {uploadStatus === 'uploading' ? 'Uploading...' : 'Upload Document'}
              </Button>
            </Box>
          </Box>

          {uploadStatus === 'uploading' && (
            <Box sx={{ mb: 3 }}>
              <LinearProgress sx={{ borderRadius: 2, bgcolor: 'rgba(255,255,255,0.1)', '& .MuiLinearProgress-bar': { background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' } }} />
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', mt: 1 }}>
                Processing your document... Extracting text and creating knowledge chunks...
              </Typography>
            </Box>
          )}

          {docsLoading ? (
            <LinearProgress sx={{ borderRadius: 2, bgcolor: 'rgba(255,255,255,0.1)', '& .MuiLinearProgress-bar': { background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' } }} />
          ) : documents.length === 0 ? (
            <Alert
              severity="info"
              sx={{
                borderRadius: '12px',
                background: 'rgba(99,102,241,0.08)',
                border: '1px solid rgba(99,102,241,0.2)',
                color: 'rgba(255,255,255,0.8)',
                '& .MuiAlert-icon': { color: '#8B5CF6' }
              }}
            >
              No documents uploaded yet. Upload a PDF or TXT file to give your AI Twin specific business knowledge!
            </Alert>
          ) : (
            <Box>
              {documents.map((doc) => (
                <Box
                  key={doc.id}
                  sx={{
                    p: 2, mb: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    borderRadius: '12px', bgcolor: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    transition: 'all 0.2s ease',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.1)' }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ p: 1, borderRadius: '8px', bgcolor: 'rgba(99,102,241,0.1)', color: '#8B5CF6' }}>
                      <Description sx={{ fontSize: 20 }} />
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" sx={{ color: '#fff' }}>{doc.filename}</Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                        {formatFileSize(doc.file_size)} • {doc.chunk_count} chunks •{' '}
                        <Chip
                          label={doc.status}
                          size="small"
                          sx={{
                            ml: 0.5, height: 18, fontSize: '10px',
                            bgcolor: doc.status === 'ready' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
                            color: doc.status === 'ready' ? '#34D399' : '#FBBF24',
                          }}
                        />
                      </Typography>
                    </Box>
                  </Box>
                  <IconButton
                    size="small"
                    onClick={() => deleteMutation.mutate(doc.id)}
                    title="Delete document"
                    sx={{ color: 'rgba(255,255,255,0.4)', '&:hover': { color: '#EF4444', bgcolor: 'rgba(239,68,68,0.1)' } }}
                  >
                    <Delete sx={{ fontSize: 20 }} />
                  </IconButton>
                </Box>
              ))}
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)', mt: 2 }}>
                💡 Tip: The more detailed your documents, the better your AI Twin can answer customer questions!
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </Box>
  );
};

export default DigitalTwinDetail;

