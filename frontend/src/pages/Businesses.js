import React, { useState } from 'react';
import {
  Box, Typography, Button, Grid, Card, CardContent, CardActions,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton,
  useTheme, alpha
} from '@mui/material';
import { Add, Edit, Delete, Business as BusinessIcon, Language, Phone, Email } from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Alert, AlertTitle } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Businesses = () => {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', industry: '', website: '', phone: '', email: '' });
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const queryClient = useQueryClient();

  const { data: businesses, isLoading } = useQuery({
    queryKey: ['businesses'],
    queryFn: () => api.get('/businesses/').then(res => res.data),
  });

  const createMutation = useMutation({
    mutationFn: (data) => api.post('/businesses/', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['businesses']);
      setOpen(false);
      setFormData({ name: '', description: '', industry: '', website: '', phone: '', email: '' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/businesses/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['businesses']);
      setOpen(false);
      setEditing(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/businesses/${id}`),
    onSuccess: () => queryClient.invalidateQueries(['businesses']),
  });

  const handleOpen = (business = null) => {
    if (business) {
      setEditing(business);
      setFormData(business);
    } else {
      setEditing(null);
      setFormData({ name: '', description: '', industry: '', website: '', phone: '', email: '' });
    }
    setOpen(true);
  };

  const handleSubmit = () => {
    if (editing) {
      updateMutation.mutate({ id: editing.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

  if (isLoading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'rgba(255, 255, 255, 0.7)' }}>
      <Typography variant="h6" sx={{ fontFamily: '"Outfit", sans-serif' }}>Loading businesses...</Typography>
    </Box>
  );

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto' }}>
      {user?.subscription_status === 'expired' && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
          <AlertTitle>Subscription Expired</AlertTitle>
          Your trial or subscription has expired. Please upgrade to Pro to continue adding or editing businesses.
          <Button 
            variant="contained" 
            color="error" 
            size="small" 
            sx={{ ml: 2, textTransform: 'none' }}
            onClick={() => navigate('/pricing')}
          >
            Upgrade Now
          </Button>
        </Alert>
      )}

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2, mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 700, color: '#fff', mb: 1 }}>
            Businesses
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.6)', fontFamily: '"Inter", sans-serif' }}>
            Manage your digital twin businesses and properties
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<Add />} 
          onClick={() => handleOpen()}
          disabled={user?.subscription_status === 'expired'}
          sx={{
            background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
            textTransform: 'none',
            fontFamily: '"Outfit", sans-serif',
            fontWeight: 600,
            borderRadius: '12px',
            px: 3,
            py: 1.5,
            boxShadow: '0 8px 16px rgba(99, 102, 241, 0.2)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5046e5 0%, #7c3aed 100%)',
              boxShadow: '0 12px 20px rgba(99, 102, 241, 0.3)',
            }
          }}
        >
          Add Business
        </Button>
      </Box>

      <motion.div variants={containerVariants} initial="hidden" animate="show">
        <Grid container spacing={3}>
          {businesses?.map((business) => (
            <Grid item xs={12} sm={6} md={4} key={business.id}>
              <motion.div variants={itemVariants}>
                <Card sx={{ 
                  background: 'rgba(255, 255, 255, 0.03)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: '16px',
                  color: '#fff',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 24px rgba(0,0,0, 0.4)',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                  }
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ 
                        p: 1.5, 
                        borderRadius: '12px', 
                        background: 'rgba(99, 102, 241, 0.1)', 
                        color: '#8B5CF6',
                        mr: 2
                      }}>
                        <BusinessIcon />
                      </Box>
                      <Box>
                        <Typography variant="h6" sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 600 }}>
                          {business.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.7rem' }}>
                          {business.industry}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Typography variant="body2" sx={{ mt: 2, mb: 3, color: 'rgba(255,255,255,0.7)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {business.description || 'No description provided.'}
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {business.website && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'rgba(255,255,255,0.6)' }}>
                          <Language sx={{ fontSize: 16 }} />
                          <Typography variant="caption">{business.website}</Typography>
                        </Box>
                      )}
                      {business.email && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'rgba(255,255,255,0.6)' }}>
                          <Email sx={{ fontSize: 16 }} />
                          <Typography variant="caption">{business.email}</Typography>
                        </Box>
                      )}
                    </Box>
                  </CardContent>
                  <CardActions sx={{ px: 3, pb: 3, pt: 0, justifyContent: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.05)', mt: 2 }}>
                    <IconButton 
                      onClick={() => handleOpen(business)} 
                      disabled={user?.subscription_status === 'expired'}
                      sx={{ color: 'rgba(255,255,255,0.6)', '&:hover': { color: '#6366F1', background: 'rgba(99, 102, 241, 0.1)' } }}
                    ><Edit sx={{ fontSize: 20 }} /></IconButton>
                    <IconButton 
                      onClick={() => deleteMutation.mutate(business.id)} 
                      disabled={user?.subscription_status === 'expired'}
                      sx={{ color: 'rgba(255,255,255,0.6)', '&:hover': { color: '#EF4444', background: 'rgba(239, 68, 68, 0.1)' } }}
                    ><Delete sx={{ fontSize: 20 }} /></IconButton>
                  </CardActions>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </motion.div>

      <Dialog 
        open={open} 
        onClose={() => setOpen(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            background: '#121629',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px',
            color: '#fff',
            boxShadow: '0 24px 48px rgba(0,0,0,0.5)',
          }
        }}
      >
        <DialogTitle sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.05)', pb: 2 }}>
          {editing ? 'Edit Business' : 'Add New Business'}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {[
            { label: 'Business Name', field: 'name', autoFocus: true },
            { label: 'Industry', field: 'industry' },
            { label: 'Website', field: 'website' },
            { label: 'Phone', field: 'phone' },
            { label: 'Email', field: 'email' },
          ].map((item) => (
            <TextField 
              key={item.field}
              fullWidth 
              label={item.label} 
              margin="normal" 
              autoFocus={item.autoFocus}
              value={formData[item.field]} 
              onChange={(e) => setFormData({ ...formData, [item.field]: e.target.value })} 
              InputLabelProps={{ style: { color: 'rgba(255,255,255,0.6)' } }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#fff',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                  '&.Mui-focused fieldset': { borderColor: '#6366F1' },
                }
              }}
            />
          ))}
          <TextField 
            fullWidth 
            label="Description" 
            margin="normal" 
            multiline 
            rows={3} 
            value={formData.description} 
            onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
            InputLabelProps={{ style: { color: 'rgba(255,255,255,0.6)' } }}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#fff',
                '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                '&.Mui-focused fieldset': { borderColor: '#6366F1' },
              }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid rgba(255,255,255,0.05)', p: 2.5 }}>
          <Button onClick={() => setOpen(false)} sx={{ color: 'rgba(255,255,255,0.6)', textTransform: 'none' }}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
              textTransform: 'none',
              borderRadius: '8px',
              px: 3,
              '&:hover': {
                background: 'linear-gradient(135deg, #5046e5 0%, #7c3aed 100%)',
              }
            }}
          >
            {editing ? 'Save Changes' : 'Create Business'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Businesses;
