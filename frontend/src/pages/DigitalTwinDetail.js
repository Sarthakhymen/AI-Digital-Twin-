import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box, Typography, Paper, Grid, Chip, Button, Card, CardContent,
  List, ListItem, ListItemText, Divider, LinearProgress, Alert,
  IconButton, Snackbar
} from '@mui/material';
import { ArrowBack, PlayArrow, Pause, Edit, CloudUpload, Delete, Description, ContentCopy, Code, Public } from '@mui/icons-material';
import api from '../services/api';
import WhatsAppScanner from '../components/WhatsAppScanner';


const DigitalTwinDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

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

  if (isLoading) return <Typography>Loading...</Typography>;
  if (!twin) return <Typography>Digital twin not found</Typography>;

  return (
    <Box>
      <Button startIcon={<ArrowBack />} onClick={() => navigate('/')} sx={{ mb: 2 }}>
        Back to Dashboard
      </Button>
      
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h4">{twin.name}</Typography>
            <Chip label={twin.status} color={getStatusColor(twin.status)} sx={{ mt: 1 }} />
          </Box>
          <Box>
            <Button startIcon={<Edit />} sx={{ mr: 1 }}>Edit</Button>
            {(twin.status === 'trained' || twin.status === 'training') && (
              <Button variant="contained" startIcon={<PlayArrow />} onClick={() => activateMutation.mutate()}>
                Activate
              </Button>
            )}
            {twin.status === 'active' && (
              <Button variant="outlined" startIcon={<Pause />}>Pause</Button>
            )}
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>Description</Typography>
            <Typography color="text.secondary">{twin.description || 'No description provided'}</Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Personality Profile</Typography>
            {twin.personality_profile ? (
              <List dense>
                {Object.entries(twin.personality_profile).map(([key, value]) => (
                  <ListItem key={key}>
                    <ListItemText primary={key} secondary={JSON.stringify(value)} />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography color="text.secondary">No personality profile configured</Typography>
            )}
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>Communication Style</Typography>
            {twin.communication_style ? (
              <Card variant="outlined">
                <CardContent>
                  {Object.entries(twin.communication_style).map(([key, value]) => (
                    <Box key={key} sx={{ mb: 1 }}>
                      <Typography variant="subtitle2" color="primary">{key}</Typography>
                      <Typography variant="body2">{value}</Typography>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            ) : (
              <Typography color="text.secondary">No communication style set</Typography>
            )}

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Voice Samples</Typography>
            <Typography color="text.secondary">
              {twin.voice_samples?.length ? `${twin.voice_samples.length} samples uploaded` : 'No voice samples'}
            </Typography>

            <Divider sx={{ my: 3 }} />
            
            <Typography variant="h6" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Public fontSize="small" /> Integrations
            </Typography>
            
            <Box sx={{ mt: 3, p: 3, borderRadius: 3, bgcolor: 'rgba(102, 126, 234, 0.04)', border: '1px solid rgba(102, 126, 234, 0.1)' }}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Code color="primary" /> Web Chat Widget
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Add this premium chat widget to your website. Simply copy and paste this script tag into your website's <code>&lt;head&gt;</code> section.
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
                      const snippet = `<script src="${process.env.REACT_APP_API_URL || 'https://ai-digital-twin-2le9.onrender.com/api/v1'}/integrations/${id}/widget.js"></script>`;
                      navigator.clipboard.writeText(snippet);
                      setSnackbar({ open: true, message: 'Snippet copied to clipboard!', severity: 'success' });
                    }}
                  >
                    <ContentCopy fontSize="small" />
                  </IconButton>
                </Box>
                <code style={{ wordBreak: 'break-all' }}>
                  {`<script src="${process.env.REACT_APP_API_URL || 'https://ai-digital-twin-2le9.onrender.com/api/v1'}/integrations/${id}/widget.js"></script>`}
                </code>
              </Paper>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                <Box 
                  sx={{ 
                    width: 40, height: 40, borderRadius: '50%', 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 10px rgba(102,126,234,0.3)'
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  Widget will appear as a sleek chat bubble in the bottom-right corner.
                </Typography>
              </Box>
            </Box>

            <Box sx={{ mt: 4 }}>
              <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                WhatsApp Connection (Beta)
              </Typography>
              <WhatsAppScanner twinId={id} />
            </Box>
          </Grid>
        </Grid>
      </Paper>


      {/* ========== KNOWLEDGE BASE SECTION ========== */}
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>📚 Knowledge Base</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Upload PDFs or text files to train your Digital Twin with business-specific knowledge.
            </Typography>
          </Box>
          <Box>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".pdf,.txt"
              style={{ display: 'none' }}
            />
            <Button
              variant="contained"
              startIcon={<CloudUpload />}
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadStatus === 'uploading'}
              sx={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': { background: 'linear-gradient(135deg, #5a6fd6 0%, #6a4190 100%)' }
              }}
            >
              {uploadStatus === 'uploading' ? 'Uploading...' : 'Upload Document'}
            </Button>
          </Box>
        </Box>

        {uploadStatus === 'uploading' && (
          <Box sx={{ mb: 2 }}>
            <LinearProgress sx={{ borderRadius: 2 }} />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Processing your document... Extracting text and creating knowledge chunks...
            </Typography>
          </Box>
        )}

        {docsLoading ? (
          <LinearProgress />
        ) : documents.length === 0 ? (
          <Alert severity="info" sx={{ borderRadius: 2 }}>
            No documents uploaded yet. Upload a PDF or TXT file to give your AI Twin specific business knowledge!
          </Alert>
        ) : (
          <Box>
            {documents.map((doc) => (
              <Paper
                key={doc.id}
                variant="outlined"
                sx={{
                  p: 2, mb: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  borderRadius: 2, '&:hover': { bgcolor: '#f5f5f5' }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Description color="primary" />
                  <Box>
                    <Typography variant="subtitle2">{doc.filename}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatFileSize(doc.file_size)} • {doc.chunk_count} chunks • 
                      <Chip 
                        label={doc.status} 
                        size="small" 
                        color={doc.status === 'ready' ? 'success' : 'warning'} 
                        sx={{ ml: 1, height: 20, fontSize: '11px' }} 
                      />
                    </Typography>
                  </Box>
                </Box>
                <IconButton 
                  color="error" 
                  size="small" 
                  onClick={() => deleteMutation.mutate(doc.id)}
                  title="Delete document"
                >
                  <Delete />
                </IconButton>
              </Paper>
            ))}
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              💡 Tip: The more detailed your documents, the better your AI Twin can answer customer questions!
            </Typography>
          </Box>
        )}
      </Paper>

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

