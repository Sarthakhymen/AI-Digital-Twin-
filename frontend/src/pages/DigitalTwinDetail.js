import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box, Typography, Paper, Grid, Chip, Button, Card, CardContent,
  List, ListItem, ListItemText, Divider, LinearProgress, Alert,
  IconButton, Snackbar, ToggleButton, ToggleButtonGroup, TextField,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip
} from '@mui/material';
import { ArrowBack, PlayArrow, Pause, Edit, CloudUpload, Delete, Description, ContentCopy, Code, Public, FormatAlignLeft, FormatAlignRight, Language, Email, Star } from '@mui/icons-material';
import api from '../services/api';
import WhatsAppScanner from '../components/WhatsAppScanner';
import TwinRobotAvatar from '../components/TwinRobotAvatar';
import { useAuth } from '../contexts/AuthContext';
import { Lock } from '@mui/icons-material';


const DigitalTwinDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, userFeatures } = useAuth();
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);

  const plan = user?.subscription_plan || 'free';
  const isStandard = plan === 'standard';
  const isPro = plan === 'business_pro' || plan === 'pro';

  // Container 1 (Web Chat Widget) dynamic styling
  const container1Style = isPro
    ? { bgcolor: 'rgba(225, 29, 72, 0.04)', border: '1px solid rgba(225, 29, 72, 0.2)' }
    : isStandard
      ? { bgcolor: 'rgba(245, 158, 11, 0.04)', border: '1px solid rgba(245, 158, 11, 0.2)' }
      : { bgcolor: 'rgba(59, 130, 246, 0.04)', border: '1px solid rgba(59, 130, 246, 0.2)' };

  const container1BadgeText = isPro ? 'Business Pro Plan' : isStandard ? 'Standard Plan' : 'Free Trial Plan';
  const container1BadgeColor = isPro ? '#e11d48' : isStandard ? '#f59e0b' : '#3b82f6';

  // Container 2 (URL Scraping) dynamic styling
  const container2Style = isPro
    ? { bgcolor: 'rgba(225, 29, 72, 0.04)', border: '1px solid rgba(225, 29, 72, 0.2)' }
    : { bgcolor: 'rgba(245, 158, 11, 0.04)', border: '1px solid rgba(245, 158, 11, 0.2)' };

  const container2BadgeText = isPro ? 'Business Pro Plan' : 'Standard Plan';
  const container2BadgeColor = isPro ? '#e11d48' : '#f59e0b';
  const voiceInputRef = useRef(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [scrapeUrl, setScrapeUrl] = useState('');
  const [scrapeStatus, setScrapeStatus] = useState(null); // null | 'scraping' | 'done' | 'error'
  const [scrapeError, setScrapeError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [widgetPosition, setWidgetPosition] = useState('right');
  const [widgetColor, setWidgetColor] = useState('#667eea');

  // Feature gating helper
  const FeatureLock = ({ feature, children, title, upgradeTo = 'Standard' }) => {
    const isLocked = !userFeatures || !userFeatures[feature];
    
    if (!isLocked) return children;

    const lockColor = upgradeTo === 'Business Pro' ? '#e11d48' : '#f59e0b';

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
              width: 50, height: 50, borderRadius: '50%', bgcolor: `${lockColor}33`, 
              display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2,
              border: `1px solid ${lockColor}66`
            }}
          >
            <Lock sx={{ color: lockColor }} />
          </Box>
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>{title} Locked</Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2, textAlign: 'center', px: 3 }}>
            Upgrade to {upgradeTo} plan to unlock this feature.
          </Typography>
          <Button 
            variant="contained" 
            size="small"
            onClick={() => window.location.href = '/pricing'}
            sx={{ 
              bgcolor: lockColor,
              color: '#fff',
              textTransform: 'none', fontWeight: 600, borderRadius: '8px',
              '&:hover': { bgcolor: lockColor, opacity: 0.9 }
            }}
          >
            Upgrade to {upgradeTo}
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

  const { data: dailySummaries = [], isLoading: summariesLoading } = useQuery({
    queryKey: ['daily-summaries', id],
    queryFn: () => api.get(`/digital-twins/${id}/daily-summaries`).then(res => res.data),
    enabled: !!(user?.preferences?.conversation_summaries),
    retry: false,
  });

  const activateMutation = useMutation({
    mutationFn: () => api.post(`/digital-twins/${id}/activate`),
    onSuccess: () => {
      queryClient.invalidateQueries(['digital-twin', id]);
      setSnackbar({ open: true, message: 'Digital twin activated!', severity: 'success' });
    },
  });

  const pauseMutation = useMutation({
    mutationFn: () => api.post(`/digital-twins/${id}/pause`),
    onSuccess: () => {
      queryClient.invalidateQueries(['digital-twin', id]);
      setSnackbar({ open: true, message: 'Digital twin paused!', severity: 'info' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (docId) => api.delete(`/knowledge/${id}/documents/${docId}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['knowledge-docs', id]);
      setSnackbar({ open: true, message: 'Document deleted!', severity: 'success' });
    },
  });

  const { data: leads = [] } = useQuery({
    queryKey: ['leads', id],
    queryFn: () => api.get(`/knowledge/${id}/leads`).then(res => res.data),
    enabled: !!(userFeatures && userFeatures.lead_generation),
    retry: false,
  });

  const handleScrapeUrl = async () => {
    if (!scrapeUrl.trim()) return;
    setScrapeStatus('scraping');
    setScrapeError('');
    try {
      await api.post(`/knowledge/${id}/scrape-url`, { url: scrapeUrl.trim() });
      queryClient.invalidateQueries(['knowledge-docs', id]);
      setScrapeStatus('done');
      setScrapeUrl('');
      setSnackbar({ open: true, message: '✅ URL scraped & indexed successfully!', severity: 'success' });
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to scrape URL. Please try again.';
      setScrapeStatus('error');
      setScrapeError(msg);
    }
  };

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

  const exportLeadsToCSV = () => {
    if (!leads || leads.length === 0) return;
    const headers = ["Name", "Email", "Phone", "Captured At"];
    const rows = leads.map(lead => [
      lead.name || "",
      lead.email || "",
      lead.phone || "",
      lead.created_at ? new Date(lead.created_at).toLocaleString('en-IN') : ""
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.map(val => `"${val.replace(/"/g, '""')}"`).join(","))].join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${twin?.name || 'twin'}_leads.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
              {(twin.status === 'trained' || twin.status === 'training' || twin.status === 'paused' || twin.status === 'inactive') && (
                <Button
                  variant="contained"
                  startIcon={<PlayArrow />}
                  onClick={() => activateMutation.mutate()}
                  sx={{ background: '#ffffff', color: '#0a0a0f', textTransform: 'none', borderRadius: '10px', '&:hover': { background: '#e2e8f0' }, fontWeight: 600 }}
                >
                  {twin.status === 'paused' || twin.status === 'inactive' ? 'Resume' : 'Activate'}
                </Button>
              )}
              {twin.status === 'active' && (
                <Button
                  variant="outlined"
                  startIcon={<Pause />}
                  onClick={() => pauseMutation.mutate()}
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
              <Box sx={{ 
                background: 'rgba(255,255,255,0.02)', 
                border: '1px solid rgba(255,255,255,0.06)', 
                borderRadius: '16px', 
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <TwinRobotAvatar 
                  communicationStyle={twin.communication_style}
                  personalityProfile={twin.personality_profile}
                  name={twin.name}
                />
              </Box>

              {/* Daily Conversation Summaries Section */}
              <Box sx={{ mt: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Description fontSize="small" sx={{ color: '#8B5CF6' }} /> Daily AI Summaries
                  </Typography>
                  {user?.preferences?.conversation_summaries && (
                    <Chip 
                      label="7-Day Feed" 
                      size="small" 
                      sx={{ 
                        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(99, 102, 241, 0.15) 100%)', 
                        color: '#a78bfa', 
                        fontWeight: 600,
                        border: '1px solid rgba(139, 92, 246, 0.3)'
                      }} 
                    />
                  )}
                </Box>

                {!user?.preferences?.conversation_summaries ? (
                  <Card sx={{ 
                    background: 'rgba(255,255,255,0.01)', 
                    border: '1px dashed rgba(255,255,255,0.12)', 
                    borderRadius: '16px', 
                    p: 3,
                    textAlign: 'center',
                    boxShadow: 'none'
                  }}>
                    <CardContent sx={{ p: 0 }}>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 2, lineHeight: 1.6 }}>
                        💡 Daily Conversation Summaries are currently turned off. Turn them on to see automatically generated daily summaries of all your twin's interactions.
                      </Typography>
                      <Button 
                        variant="outlined" 
                        size="small" 
                        onClick={() => navigate('/settings')}
                        sx={{ 
                          color: '#8B5CF6', 
                          borderColor: 'rgba(139, 92, 246, 0.4)',
                          textTransform: 'none',
                          borderRadius: '8px',
                          fontWeight: 600,
                          '&:hover': { borderColor: '#8B5CF6', background: 'rgba(139, 92, 246, 0.05)' }
                        }}
                      >
                        Configure Preferences
                      </Button>
                    </CardContent>
                  </Card>
                ) : summariesLoading ? (
                  <Box sx={{ width: '100%', py: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <LinearProgress sx={{ width: '80%', bgcolor: 'rgba(255,255,255,0.05)', '& .MuiLinearProgress-bar': { bgcolor: '#8B5CF6' } }} />
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>Generating daily insights...</Typography>
                  </Box>
                ) : dailySummaries.length === 0 ? (
                  <Card sx={{ 
                    background: 'rgba(255,255,255,0.01)', 
                    border: '1px solid rgba(255,255,255,0.05)', 
                    borderRadius: '16px', 
                    p: 3,
                    textAlign: 'center',
                    boxShadow: 'none'
                  }}>
                    <CardContent sx={{ p: 0 }}>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                        No summaries available yet. Your summaries will appear here daily.
                      </Typography>
                    </CardContent>
                  </Card>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {dailySummaries.map((summary) => (
                      <Card 
                        key={summary.id} 
                        sx={{ 
                          background: 'linear-gradient(135deg, rgba(255,255,255,0.01) 0%, rgba(255,255,255,0.03) 100%)', 
                          border: '1px solid rgba(255,255,255,0.06)', 
                          borderRadius: '14px', 
                          boxShadow: 'none',
                          transition: 'transform 0.2s, border-color 0.2s',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            borderColor: 'rgba(139, 92, 246, 0.2)'
                          }
                        }}
                      >
                        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                            <Typography variant="subtitle2" sx={{ color: '#a78bfa', fontWeight: 700, fontFamily: '"Outfit", sans-serif' }}>
                              {new Date(summary.summary_date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}
                            </Typography>
                            <Chip 
                              label={`${summary.conversation_count} chat${summary.conversation_count !== 1 ? 's' : ''}`}
                              size="small" 
                              sx={{ 
                                bgcolor: summary.conversation_count > 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.05)',
                                color: summary.conversation_count > 0 ? '#34d399' : 'rgba(255,255,255,0.5)',
                                fontWeight: 600,
                                fontSize: '0.75rem',
                                border: '1px solid ' + (summary.conversation_count > 0 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.1)')
                              }} 
                            />
                          </Box>
                          
                          <Box sx={{ pl: 1 }}>
                            {summary.content.split('\n').map((line, idx) => {
                              const cleanLine = line.replace(/^[•\-\*\s]+/, '').trim();
                              if (!cleanLine) return null;
                              return (
                                <Box key={idx} sx={{ display: 'flex', gap: 1, alignItems: 'flex-start', mb: idx === summary.content.split('\n').length - 1 ? 0 : 1 }}>
                                  <Typography sx={{ color: '#8B5CF6', mt: 0.2, fontSize: '0.875rem' }}>•</Typography>
                                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.85)', lineHeight: 1.5, fontSize: '0.875rem' }}>
                                    {cleanLine}
                                  </Typography>
                                </Box>
                              );
                            })}
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                )}
              </Box>
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

            {/* Container 1: Web Chat Widget */}
            <Box sx={{ mt: 3, p: 3, borderRadius: 3, position: 'relative', ...container1Style }}>
              <Box sx={{ position: 'absolute', top: -12, left: 16, bgcolor: '#020617', px: 1 }}>
                <Typography variant="caption" sx={{ color: container1BadgeColor, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  {container1BadgeText}
                </Typography>
              </Box>

              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                <Code color="primary" /> Web Chat Widget
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Add this premium chat widget to your website. Simply copy and paste this script tag into your website's <code>&lt;head&gt;</code> section.
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 3, mb: 2.5, flexWrap: 'wrap' }}>
                <Box>
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
                
                <Box>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1, display: 'block' }}>Widget Theme Color</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <input 
                      type="color" 
                      value={widgetColor} 
                      onChange={(e) => setWidgetColor(e.target.value)} 
                      style={{ 
                        width: '38px', 
                        height: '38px', 
                        border: 'none', 
                        borderRadius: '8px', 
                        cursor: 'pointer', 
                        background: 'transparent',
                        padding: 0
                      }} 
                    />
                    <TextField 
                      size="small" 
                      value={widgetColor} 
                      onChange={(e) => setWidgetColor(e.target.value)} 
                      sx={{ 
                        width: '120px',
                        '& .MuiInputBase-root': { 
                          height: '38px',
                          color: '#fff', 
                          bgcolor: 'rgba(255,255,255,0.05)', 
                          borderRadius: '8px',
                          fontSize: '13px',
                          fontFamily: '"Fira Code", monospace'
                        } 
                      }} 
                    />
                  </Box>
                </Box>
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
                      const leadAttr = userFeatures?.lead_generation ? ' data-lead-gen="true"' : '';
                      const snippet = `<script src="${process.env.REACT_APP_API_URL || 'https://ai-digital-twin-2le9.onrender.com/api/v1'}/integrations/${id}/widget.js?token=${twin?.widget_token || ''}" data-position="${widgetPosition}" data-color="${widgetColor}"${leadAttr}></script>`;
                      navigator.clipboard.writeText(snippet);
                      setSnackbar({ open: true, message: 'Chat snippet copied!', severity: 'success' });
                    }}
                  >
                    <ContentCopy fontSize="small" />
                  </IconButton>
                </Box>
                <code style={{ wordBreak: 'break-all' }}>
                  {`<script src="${process.env.REACT_APP_API_URL || 'https://ai-digital-twin-2le9.onrender.com/api/v1'}/integrations/${id}/widget.js?token=${twin?.widget_token || ''}" data-position="${widgetPosition}" data-color="${widgetColor}"${userFeatures?.lead_generation ? ' data-lead-gen="true"' : ''}></script>`}
                </code>
              </Paper>

              {/* Captured Leads — embedded inside widget section */}
              {userFeatures?.lead_generation && (
                <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Email sx={{ color: '#f59e0b', fontSize: 20 }} /> Captured Leads
                      <Chip
                        label={`${leads.length}`}
                        size="small"
                        sx={{
                          bgcolor: 'rgba(245, 158, 11, 0.15)',
                          color: '#f59e0b',
                          border: '1px solid rgba(245, 158, 11, 0.3)',
                          fontWeight: 700,
                          fontSize: '11px',
                          height: '22px',
                        }}
                      />
                    </Typography>
                    {leads.length > 0 && (
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={exportLeadsToCSV}
                        sx={{
                          color: '#f59e0b',
                          borderColor: 'rgba(245, 158, 11, 0.4)',
                          borderRadius: '8px',
                          textTransform: 'none',
                          fontSize: '12px',
                          fontWeight: 600,
                          '&:hover': {
                            bgcolor: 'rgba(245, 158, 11, 0.05)',
                            borderColor: '#f59e0b'
                          }
                        }}
                      >
                        📥 Export CSV
                      </Button>
                    )}
                  </Box>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)', mb: 2, fontSize: '12px' }}>
                    Lead capture is automatically included in your widget. Emails collected from chat visitors appear here.
                  </Typography>
                  {leads.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 4, color: 'rgba(255,255,255,0.3)', bgcolor: 'rgba(255,255,255,0.01)', borderRadius: 2, border: '1px dashed rgba(255,255,255,0.1)' }}>
                      <Email sx={{ fontSize: 36, mb: 1, opacity: 0.3, color: '#f59e0b' }} />
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>No leads captured yet</Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)' }}>Visitors will be prompted after 2 messages</Typography>
                    </Box>
                  ) : (
                    <TableContainer component={Paper} sx={{ bgcolor: 'transparent', boxShadow: 'none', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 2 }}>
                      <Table size="small">
                        <TableHead sx={{ bgcolor: 'rgba(255,255,255,0.02)' }}>
                          <TableRow>
                            <TableCell sx={{ color: 'rgba(255,255,255,0.6)', borderBottom: '1px solid rgba(255,255,255,0.06)', fontWeight: 700, fontSize: '12px' }}>Name</TableCell>
                            <TableCell sx={{ color: 'rgba(255,255,255,0.6)', borderBottom: '1px solid rgba(255,255,255,0.06)', fontWeight: 700, fontSize: '12px' }}>Email</TableCell>
                            <TableCell sx={{ color: 'rgba(255,255,255,0.6)', borderBottom: '1px solid rgba(255,255,255,0.06)', fontWeight: 700, fontSize: '12px' }}>Phone</TableCell>
                            <TableCell sx={{ color: 'rgba(255,255,255,0.6)', borderBottom: '1px solid rgba(255,255,255,0.06)', fontWeight: 700, fontSize: '12px' }}>Date</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {leads.map((lead) => (
                            <TableRow key={lead.id} sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' } }}>
                              <TableCell sx={{ color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.04)', fontWeight: 500, fontSize: '13px' }}>{lead.name || '—'}</TableCell>
                              <TableCell sx={{ color: '#f59e0b', borderBottom: '1px solid rgba(255,255,255,0.04)', fontWeight: 600, fontSize: '13px' }}>{lead.email}</TableCell>
                              <TableCell sx={{ color: 'rgba(255,255,255,0.7)', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: '13px' }}>{lead.phone || '—'}</TableCell>
                              <TableCell sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                {lead.created_at ? new Date(lead.created_at).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </Box>
              )}
            </Box>

            {/* Container 2: URL Scraping */}
            <Box sx={{ mt: 4, p: 3, borderRadius: 3, position: 'relative', ...container2Style }}>
              <Box sx={{ position: 'absolute', top: -12, left: 16, bgcolor: '#020617', px: 1 }}>
                <Typography variant="caption" sx={{ color: container2BadgeColor, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  {container2BadgeText}
                </Typography>
              </Box>

              <FeatureLock feature="url_scraping" title="Standard Features" upgradeTo="Standard">
                <Box sx={{ mt: 1 }}>

                  {/* URL Scraping Section */}
                  <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 700 }}>
                    <Language sx={{ fontSize: 18, color: '#f59e0b' }} /> URL Scraping — Auto-train from your website
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Paste any webpage URL and we'll scrape its content and add it to your AI Twin's knowledge base. Free, instant, no APIs needed.
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                    <TextField
                      size="small"
                      fullWidth
                      placeholder="https://your-website.com/about"
                      value={scrapeUrl}
                      onChange={(e) => { setScrapeUrl(e.target.value); setScrapeStatus(null); }}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleScrapeUrl(); }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          bgcolor: 'rgba(255,255,255,0.04)',
                          color: '#fff',
                          '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' },
                          '&:hover fieldset': { borderColor: 'rgba(245,158,11,0.5)' },
                          '&.Mui-focused fieldset': { borderColor: '#f59e0b' },
                        },
                        '& input::placeholder': { color: 'rgba(255,255,255,0.3)' },
                      }}
                      InputProps={{
                        startAdornment: <Language sx={{ color: 'rgba(255,255,255,0.3)', mr: 1, fontSize: 18 }} />
                      }}
                    />
                    <Button
                      variant="contained"
                      onClick={handleScrapeUrl}
                      disabled={scrapeStatus === 'scraping' || !scrapeUrl.trim()}
                      sx={{
                        bgcolor: '#f59e0b', color: '#020617', fontWeight: 700,
                        '&:hover': { bgcolor: '#d97706' }, whiteSpace: 'nowrap',
                        '&:disabled': { bgcolor: 'rgba(245,158,11,0.3)', color: 'rgba(0,0,0,0.5)' }
                      }}
                    >
                      {scrapeStatus === 'scraping' ? 'Scraping...' : '🌐 Scrape'}
                    </Button>
                  </Box>
                  {scrapeStatus === 'error' && (
                    <Alert severity="error" sx={{ mb: 2, bgcolor: 'rgba(239,68,68,0.1)', color: '#fca5a5', '& .MuiAlert-icon': { color: '#ef4444' } }}>
                      {scrapeError}
                    </Alert>
                  )}
                  {scrapeStatus === 'scraping' && (
                    <LinearProgress sx={{ mb: 2, bgcolor: 'rgba(245,158,11,0.1)', '& .MuiLinearProgress-bar': { bgcolor: '#f59e0b' } }} />
                  )}
                </Box>
              </FeatureLock>
            </Box>


            {/* Container 3: Business Pro Plan — Coming Soon for non-pro */}
            <Box sx={{ mt: 4, p: 3, borderRadius: 3, bgcolor: 'rgba(225, 29, 72, 0.04)', border: '1px solid rgba(225, 29, 72, 0.2)', position: 'relative' }}>
              <Box sx={{ position: 'absolute', top: -12, left: 16, bgcolor: '#020617', px: 1 }}>
                <Typography variant="caption" sx={{ color: '#e11d48', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Business Pro Plan
                </Typography>
              </Box>

              {isPro ? (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                    WhatsApp Connection (Basic & Advanced)
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Allow your AI Twin to respond to customer inquiries, schedule meetings, and handle bookings on WhatsApp.
                  </Typography>
                  <WhatsAppScanner twinId={id} />

                  <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.05)' }} />

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
                          const snippet = `<script src="${process.env.REACT_APP_API_URL || 'https://ai-digital-twin-2le9.onrender.com/api/v1'}/integrations/${id}/voice-widget.js?token=${twin?.widget_token || ''}"></script>`;
                          navigator.clipboard.writeText(snippet);
                          setSnackbar({ open: true, message: 'Voice snippet copied!', severity: 'success' });
                        }}
                      >
                        <ContentCopy fontSize="small" />
                      </IconButton>
                    </Box>
                    <code style={{ wordBreak: 'break-all' }}>
                      {`<script src="${process.env.REACT_APP_API_URL || 'https://ai-digital-twin-2le9.onrender.com/api/v1'}/integrations/${id}/voice-widget.js?token=${twin?.widget_token || ''}"></script>`}
                    </code>
                  </Paper>
                </Box>
              ) : (
                /* Coming Soon overlay for non-pro users */
                <Box sx={{ 
                  mt: 1, py: 5, display: 'flex', flexDirection: 'column', 
                  alignItems: 'center', justifyContent: 'center', textAlign: 'center'
                }}>
                  <Box sx={{ 
                    width: 60, height: 60, borderRadius: '50%', 
                    bgcolor: 'rgba(225, 29, 72, 0.15)', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2,
                    border: '1px solid rgba(225, 29, 72, 0.3)'
                  }}>
                    <span style={{ fontSize: '28px' }}>🚀</span>
                  </Box>
                  <Typography variant="h6" sx={{ color: '#e11d48', fontWeight: 700, mb: 1 }}>
                    Coming Soon
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 1, maxWidth: 400 }}>
                    WhatsApp Integration, Voice Agent, Advanced Analytics & more premium features are launching soon!
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.35)' }}>
                    Stay tuned for Business Pro plan
                  </Typography>
                </Box>
              )}
            </Box>

          </Grid>
        </Grid>
        </CardContent>
      </Card>

      {/* Captured Leads section is now embedded inside the Web Chat Widget section above */}


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

