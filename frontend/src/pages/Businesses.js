import React, { useState } from 'react';
import {
  Box, Typography, Button, Grid, Card, CardContent, CardActions,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';

const Businesses = () => {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', industry: '', website: '', phone: '', email: '' });
  
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

  if (isLoading) return <Typography>Loading...</Typography>;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Businesses</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>
          Add Business
        </Button>
      </Box>

      <Grid container spacing={3}>
        {businesses?.map((business) => (
          <Grid item xs={12} sm={6} md={4} key={business.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{business.name}</Typography>
                <Typography color="text.secondary">{business.industry}</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>{business.description}</Typography>
              </CardContent>
              <CardActions>
                <IconButton onClick={() => handleOpen(business)}><Edit /></IconButton>
                <IconButton onClick={() => deleteMutation.mutate(business.id)} color="error"><Delete /></IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? 'Edit Business' : 'Add Business'}</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Name" margin="normal" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          <TextField fullWidth label="Industry" margin="normal" value={formData.industry} onChange={(e) => setFormData({ ...formData, industry: e.target.value })} />
          <TextField fullWidth label="Description" margin="normal" multiline rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
          <TextField fullWidth label="Website" margin="normal" value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} />
          <TextField fullWidth label="Phone" margin="normal" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
          <TextField fullWidth label="Email" margin="normal" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">{editing ? 'Update' : 'Create'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Businesses;
