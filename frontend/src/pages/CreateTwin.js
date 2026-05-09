import React, { useState } from 'react';
import {
  Box, Typography, Stepper, Step, StepLabel, Button, TextField,
  FormControl, InputLabel, Select, MenuItem, Paper, Alert
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const steps = ['Select Business', 'Basic Info', 'Personality Profile', 'Voice Samples'];

const CreateTwin = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    business_id: '',
    name: '',
    description: '',
    personality_profile: {},
    communication_style: { tone: 'professional', formality: 'neutral', verbosity: 'moderate' }
  });
  const [error, setError] = useState('');
  
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: businesses } = useQuery({
    queryKey: ['businesses'],
    queryFn: () => api.get('/businesses/').then(res => res.data),
  });

  const createMutation = useMutation({
    mutationFn: (data) => api.post('/digital-twins/', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['digital-twins']);
      navigate('/');
    },
    onError: (err) => setError(err.response?.data?.detail || 'Failed to create digital twin'),
  });

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      createMutation.mutate(formData);
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <FormControl fullWidth>
            <InputLabel>Select Business</InputLabel>
            <Select
              value={formData.business_id}
              onChange={(e) => setFormData({ ...formData, business_id: e.target.value })}
            >
              {businesses?.map((b) => (
                <MenuItem key={b.id} value={b.id}>{b.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      case 1:
        return (
          <Box>
            <TextField
              fullWidth
              label="Digital Twin Name"
              margin="normal"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <TextField
              fullWidth
              label="Description"
              margin="normal"
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </Box>
        );
      case 2:
        return (
          <Box>
            <FormControl fullWidth margin="normal">
              <InputLabel>Communication Tone</InputLabel>
              <Select
                value={formData.communication_style.tone}
                onChange={(e) => setFormData({
                  ...formData,
                  communication_style: { ...formData.communication_style, tone: e.target.value }
                })}
              >
                <MenuItem value="professional">Professional</MenuItem>
                <MenuItem value="friendly">Friendly</MenuItem>
                <MenuItem value="casual">Casual</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Formality Level</InputLabel>
              <Select
                value={formData.communication_style.formality}
                onChange={(e) => setFormData({
                  ...formData,
                  communication_style: { ...formData.communication_style, formality: e.target.value }
                })}
              >
                <MenuItem value="formal">Formal</MenuItem>
                <MenuItem value="neutral">Neutral</MenuItem>
                <MenuItem value="casual">Casual</MenuItem>
              </Select>
            </FormControl>
          </Box>
        );
      case 3:
        return (
          <Box>
            <Typography variant="body1" gutterBottom>
              Upload voice samples to train your digital twin (optional for MVP)
            </Typography>
            <input type="file" accept="audio/*" style={{ marginTop: 16 }} />
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box maxWidth="md" mx="auto">
      <Typography variant="h4" gutterBottom>Create Digital Twin</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => <Step key={label}><StepLabel>{label}</StepLabel></Step>)}
      </Stepper>
      <Paper elevation={2} sx={{ p: 4 }}>
        {renderStepContent(activeStep)}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button disabled={activeStep === 0} onClick={handleBack}>Back</Button>
          <Button variant="contained" onClick={handleNext}>
            {activeStep === steps.length - 1 ? 'Create' : 'Next'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default CreateTwin;
