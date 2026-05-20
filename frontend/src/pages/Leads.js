import React, { useState } from 'react';
import { 
  Box, Typography, Paper, Grid, Card, CardContent, Button, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, MenuItem, Select, FormControl, InputLabel, Chip, Alert, AlertTitle,
  CircularProgress, InputAdornment
} from '@mui/material';
import { 
  Email, Search, Download
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Leads = () => {
  const { user, userFeatures } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTwin, setSelectedTwin] = useState('all');

  const isLocked = !userFeatures?.lead_generation;
  const isExpired = user?.subscription_status === 'expired';

  // Fetch all leads across all twins
  const { data: leads = [], isLoading } = useQuery({
    queryKey: ['leads-all'],
    queryFn: () => api.get('/knowledge/leads/all').then(res => res.data),
    enabled: !isLocked && !isExpired,
    retry: false,
  });

  // Filter leads based on search term and selected twin
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      (lead.name && lead.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (lead.email && lead.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (lead.phone && lead.phone.includes(searchTerm));
      
    const matchesTwin = selectedTwin === 'all' || lead.digital_twin_id === Number(selectedTwin);
    
    return matchesSearch && matchesTwin;
  });

  // Get unique twins from leads to populate the filter dropdown
  const uniqueTwins = Array.from(
    new Map(leads.map(lead => [lead.digital_twin_id, { id: lead.digital_twin_id, name: lead.digital_twin_name }])).values()
  );

  const exportLeadsToCSV = () => {
    if (filteredLeads.length === 0) return;
    const headers = ["Name", "Email", "Phone", "AI Twin", "Message", "Source", "Captured At"];
    const rows = filteredLeads.map(lead => [
      lead.name || "",
      lead.email || "",
      lead.phone || "",
      lead.digital_twin_name || "",
      lead.message || "",
      lead.source || "",
      lead.created_at ? new Date(lead.created_at).toLocaleString('en-IN') : ""
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.map(val => `"${val.replace(/"/g, '""')}"`).join(","))].join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `captured_leads.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto' }}>
      
      {/* Locked / Expired State */}
      {(isLocked || isExpired) ? (
        <Box sx={{ maxWidth: '650px', mx: 'auto', mt: 4 }}>
          <Alert
            severity={isExpired ? 'error' : 'warning'}
            sx={{
              borderRadius: '16px',
              background: isExpired ? 'rgba(239,68,68,0.08)' : 'rgba(245,158,11,0.08)',
              border: `1px solid ${isExpired ? 'rgba(239,68,68,0.3)' : 'rgba(245,158,11,0.3)'}`,
              color: 'white',
              p: 3,
              '& .MuiAlert-icon': { color: isExpired ? '#EF4444' : '#F59E0B', fontSize: 32, mt: 0.5 }
            }}
          >
            <AlertTitle sx={{ color: isExpired ? '#EF4444' : '#F59E0B', fontWeight: 800, fontFamily: '"Outfit", sans-serif', fontSize: '1.1rem', mb: 1 }}>
              {isExpired ? 'Subscription Expired' : 'Lead Generation is Locked'}
            </AlertTitle>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)', mb: 3, lineHeight: 1.6 }}>
              {isExpired
                ? 'Your trial or subscription has expired. Please upgrade or renew your subscription to view and manage captured leads.'
                : 'Lead Generation is a premium feature. Upgrade to the Standard Plan to collect customer names, emails, and phone numbers directly from your AI website widget.'
              }
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/pricing')}
              sx={{
                background: isExpired ? '#EF4444' : 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: isExpired ? '#fff' : '#020617',
                textTransform: 'none',
                fontWeight: 700,
                fontFamily: '"Outfit", sans-serif',
                borderRadius: '10px',
                px: 3,
                py: 1,
                boxShadow: isExpired ? 'none' : '0 4px 14px rgba(245, 158, 11, 0.39)',
                '&:hover': { background: isExpired ? '#EF4444' : '#d97706', filter: 'brightness(1.1)' }
              }}
            >
              Upgrade Now
            </Button>
          </Alert>

          {/* Blurred Placeholder Table to make it look premium and entice them */}
          <Box sx={{ mt: 4, filter: 'blur(4px)', opacity: 0.4, pointerEvents: 'none' }}>
            <TableContainer component={Paper} sx={{ background: '#0a0a0f', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px' }}>
              <Table>
                <TableHead sx={{ bgcolor: 'rgba(255,255,255,0.02)' }}>
                  <TableRow>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 700 }}>Name</TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 700 }}>Email</TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 700 }}>Phone</TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 700 }}>AI Twin</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[1, 2, 3].map((i) => (
                    <TableRow key={i}>
                      <TableCell sx={{ color: '#fff' }}>Demo Lead {i}</TableCell>
                      <TableCell sx={{ color: '#f59e0b' }}>demo{i}@website.com</TableCell>
                      <TableCell sx={{ color: 'rgba(255,255,255,0.7)' }}>+91 98765 4321{i}</TableCell>
                      <TableCell sx={{ color: 'rgba(255,255,255,0.7)' }}>AI Assistant</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      ) : (
        <>
          {/* Header section */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4, flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h4" sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: 2 }}>
                👥 Captured Leads
                <Chip 
                  label={`${filteredLeads.length} total`} 
                  size="small" 
                  sx={{ 
                    bgcolor: 'rgba(245, 158, 11, 0.15)', 
                    color: '#f59e0b', 
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    fontFamily: '"Outfit", sans-serif',
                    fontWeight: 700 
                  }} 
                />
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', mt: 0.5 }}>
                View, filter, and export contact details collected from your digital twin chat widgets.
              </Typography>
            </Box>

            {filteredLeads.length > 0 && (
              <Button
                variant="outlined"
                startIcon={<Download />}
                onClick={exportLeadsToCSV}
                sx={{
                  color: '#f59e0b',
                  borderColor: 'rgba(245, 158, 11, 0.4)',
                  borderRadius: '10px',
                  textTransform: 'none',
                  fontFamily: '"Outfit", sans-serif',
                  fontWeight: 600,
                  '&:hover': {
                    bgcolor: 'rgba(245, 158, 11, 0.05)',
                    borderColor: '#f59e0b'
                  }
                }}
              >
                Export CSV
              </Button>
            )}
          </Box>

          {/* Stats Summaries */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={4}>
              <Card sx={{ background: '#0a0a0f', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', color: '#fff' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Leads</Typography>
                  <Typography variant="h3" sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800, mt: 1, color: '#fff' }}>{leads.length}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card sx={{ background: '#0a0a0f', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', color: '#fff' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Filtered Leads</Typography>
                  <Typography variant="h3" sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800, mt: 1, color: '#f59e0b' }}>{filteredLeads.length}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card sx={{ background: '#0a0a0f', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', color: '#fff' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Unique Channels</Typography>
                  <Typography variant="h3" sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800, mt: 1, color: '#a78bfa' }}>{uniqueTwins.length}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Filters Bar */}
          <Paper sx={{ background: '#0a0a0f', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', p: 2, mb: 4 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={8}>
                <TextField
                  fullWidth
                  placeholder="Search by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ color: 'rgba(255,255,255,0.3)' }} />
                      </InputAdornment>
                    ),
                    sx: {
                      bgcolor: 'rgba(255,255,255,0.03)',
                      color: '#fff',
                      borderRadius: '10px',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.08)' },
                      '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.15)' },
                      '&.Mui-focused fieldset': { borderColor: '#f59e0b' }
                    }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth size="small">
                  <InputLabel id="twin-filter-label" sx={{ color: 'rgba(255,255,255,0.4)' }}>Filter by AI Twin</InputLabel>
                  <Select
                    labelId="twin-filter-label"
                    value={selectedTwin}
                    label="Filter by AI Twin"
                    onChange={(e) => setSelectedTwin(e.target.value)}
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.03)',
                      color: '#fff',
                      borderRadius: '10px',
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.08)' },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.15)' },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#f59e0b' },
                      '& .MuiSvgIcon-root': { color: 'rgba(255,255,255,0.5)' }
                    }}
                  >
                    <MenuItem value="all">All Twins</MenuItem>
                    {uniqueTwins.map((twin) => (
                      <MenuItem key={twin.id} value={twin.id}>{twin.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>

          {/* Table of Leads */}
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress sx={{ color: '#f59e0b' }} />
            </Box>
          ) : filteredLeads.length === 0 ? (
            <Paper sx={{ 
              background: '#0a0a0f', 
              border: '1px dashed rgba(255,255,255,0.1)', 
              borderRadius: '16px', 
              p: 6, 
              textAlign: 'center' 
            }}>
              <Email sx={{ fontSize: 60, color: 'rgba(255,255,255,0.2)', mb: 2 }} />
              <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>No leads found</Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)', mt: 0.5 }}>
                {searchTerm || selectedTwin !== 'all' 
                  ? 'Try modifying your filters or search term.'
                  : 'Ensure you have enabled data-lead-gen="true" on your chat widget.'
                }
              </Typography>
            </Paper>
          ) : (
            <TableContainer component={Paper} sx={{ background: '#0a0a0f', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', overflow: 'hidden' }}>
              <Table>
                <TableHead sx={{ bgcolor: 'rgba(255,255,255,0.02)' }}>
                  <TableRow>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Name</TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Email</TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Phone</TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>AI Twin Source</TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Captured Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredLeads.map((lead) => (
                    <TableRow key={lead.id} sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.01)' } }}>
                      <TableCell sx={{ color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.04)', fontWeight: 500 }}>{lead.name || '—'}</TableCell>
                      <TableCell sx={{ color: '#f59e0b', borderBottom: '1px solid rgba(255,255,255,0.04)', fontWeight: 600 }}>{lead.email}</TableCell>
                      <TableCell sx={{ color: 'rgba(255,255,255,0.7)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>{lead.phone || '—'}</TableCell>
                      <TableCell sx={{ color: '#a78bfa', borderBottom: '1px solid rgba(255,255,255,0.04)', fontWeight: 500 }}>{lead.digital_twin_name || 'Unknown'}</TableCell>
                      <TableCell sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        {lead.created_at ? new Date(lead.created_at).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </>
      )}
    </Box>
  );
};

export default Leads;
