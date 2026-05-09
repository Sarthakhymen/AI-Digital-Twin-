import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box, Typography, Paper, Grid, Chip, Button, Card, CardContent,
  List, ListItem, ListItemText, Divider
} from '@mui/material';
import { ArrowBack, PlayArrow, Pause, Edit } from '@mui/icons-material';
import api from '../services/api';

const DigitalTwinDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: twin, isLoading } = useQuery({
    queryKey: ['digital-twin', id],
    queryFn: () => api.get(`/digital-twins/${id}`).then(res => res.data),
  });

  const activateMutation = useMutation({
    mutationFn: () => api.post(`/digital-twins/${id}/activate`),
    onSuccess: () => queryClient.invalidateQueries(['digital-twin', id]),
  });

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
            
            <Typography variant="h6" gutterBottom color="primary">Integrations</Typography>
            <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>Web Widget Snippet</Typography>
            <Paper variant="outlined" sx={{ p: 2, bgcolor: '#f8f9fa', fontFamily: 'monospace', fontSize: '12px' }}>
              {`<script src="${process.env.REACT_APP_API_URL || 'https://ai-digital-twin-2le9.onrender.com/api/v1'}/integrations/${id}/widget.js"></script>`}
            </Paper>
            
            <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>WhatsApp Webhook URL</Typography>
            <Paper variant="outlined" sx={{ p: 2, bgcolor: '#f8f9fa', fontFamily: 'monospace', fontSize: '12px' }}>
              {`${process.env.REACT_APP_API_URL || 'https://ai-digital-twin-2le9.onrender.com/api/v1'}/whatsapp/webhook`}
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default DigitalTwinDetail;
