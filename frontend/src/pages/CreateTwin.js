import React, { useState } from 'react';
import {
  Box, Typography, Stepper, Step, StepLabel, Button, TextField,
  FormControl, InputLabel, Select, MenuItem, Card, CardContent, Alert, useTheme, StepConnector, stepConnectorClasses
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const CustomConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: { top: 10, left: 'calc(-50% + 16px)', right: 'calc(50% + 16px)' },
  [`&.${stepConnectorClasses.active}`]: { [`& .${stepConnectorClasses.line}`]: { borderColor: '#8B5CF6' } },
  [`&.${stepConnectorClasses.completed}`]: { [`& .${stepConnectorClasses.line}`]: { borderColor: '#8B5CF6' } },
  [`& .${stepConnectorClasses.line}`]: { borderColor: 'rgba(255,255,255,0.1)', borderTopWidth: 3, borderRadius: 1 },
}));

const CustomStepIconRoot = styled('div')(({ theme, ownerState }) => ({
  backgroundColor: 'rgba(255,255,255,0.1)',
  zIndex: 1,
  color: '#fff',
  width: 32,
  height: 32,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  ...(ownerState.active && { background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)', boxShadow: '0 4px 10px rgba(99, 102, 241, .25)' }),
  ...(ownerState.completed && { background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)' }),
}));

function CustomStepIcon(props) {
  const { active, completed, className } = props;
  return (
    <CustomStepIconRoot ownerState={{ completed, active }} className={className}>
      {String(props.icon)}
    </CustomStepIconRoot>
  );
}

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

  const textFieldSx = {
    '& .MuiOutlinedInput-root': {
      color: '#fff',
      '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
      '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
      '&.Mui-focused fieldset': { borderColor: '#6366F1' },
    }
  };

  const selectSx = {
    color: '#fff',
    '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' },
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#6366F1' },
    '.MuiSvgIcon-root ': { fill: 'white !important' }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <FormControl fullWidth margin="normal">
            <InputLabel sx={{ color: 'rgba(255,255,255,0.6)' }}>Select Business</InputLabel>
            <Select
              value={formData.business_id}
              onChange={(e) => setFormData({ ...formData, business_id: e.target.value })}
              label="Select Business"
              sx={selectSx}
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
              InputLabelProps={{ style: { color: 'rgba(255,255,255,0.6)' } }}
              sx={textFieldSx}
            />
            <TextField
              fullWidth
              label="Description"
              margin="normal"
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              InputLabelProps={{ style: { color: 'rgba(255,255,255,0.6)' } }}
              sx={textFieldSx}
            />
          </Box>
        );
      case 2:
        return (
          <Box>
            <FormControl fullWidth margin="normal">
              <InputLabel sx={{ color: 'rgba(255,255,255,0.6)' }}>Communication Tone</InputLabel>
              <Select
                value={formData.communication_style.tone}
                onChange={(e) => setFormData({
                  ...formData,
                  communication_style: { ...formData.communication_style, tone: e.target.value }
                })}
                label="Communication Tone"
                sx={selectSx}
              >
                <MenuItem value="professional">Professional</MenuItem>
                <MenuItem value="friendly">Friendly</MenuItem>
                <MenuItem value="casual">Casual</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel sx={{ color: 'rgba(255,255,255,0.6)' }}>Formality Level</InputLabel>
              <Select
                value={formData.communication_style.formality}
                onChange={(e) => setFormData({
                  ...formData,
                  communication_style: { ...formData.communication_style, formality: e.target.value }
                })}
                label="Formality Level"
                sx={selectSx}
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
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.6)', mb: 2 }}>
              Upload voice samples to train your digital twin (optional for MVP)
            </Typography>
            <Box sx={{ border: '2px dashed rgba(255,255,255,0.1)', borderRadius: '12px', p: 4, textAlign: 'center' }}>
              <input type="file" accept="audio/*" style={{ color: '#fff' }} />
            </Box>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 800, mx: 'auto' }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 700, color: '#fff', mb: 1 }}>
          Create Digital Twin
        </Typography>
        <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.6)', fontFamily: '"Inter", sans-serif' }}>
          Configure a new AI agent to represent your business
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>{error}</Alert>}
      
      <Stepper activeStep={activeStep} alternativeLabel connector={<CustomConnector />} sx={{ mb: 6 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel StepIconComponent={CustomStepIcon}>
              <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontFamily: '"Outfit", sans-serif', fontSize: '0.875rem' }}>{label}</Typography>
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      <Card sx={{ 
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        borderRadius: '16px',
        color: '#fff',
      }}>
        <CardContent sx={{ p: { xs: 3, md: 5 } }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderStepContent(activeStep)}
            </motion.div>
          </AnimatePresence>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 6, pt: 3, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <Button 
              disabled={activeStep === 0} 
              onClick={handleBack}
              sx={{ color: 'rgba(255,255,255,0.6)', textTransform: 'none' }}
            >
              Back
            </Button>
            <Button 
              variant="contained" 
              onClick={handleNext}
              sx={{
                background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                textTransform: 'none',
                fontFamily: '"Outfit", sans-serif',
                fontWeight: 600,
                borderRadius: '8px',
                px: 4,
                '&:hover': { background: 'linear-gradient(135deg, #5046e5 0%, #7c3aed 100%)' }
              }}
            >
              {activeStep === steps.length - 1 ? 'Create Twin' : 'Continue'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CreateTwin;
