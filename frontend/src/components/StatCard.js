import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const StatCard = ({ title, value, icon, color, trend }) => {
  const formatValue = (val) => {
    if (typeof val === 'number' && val >= 1000) {
      return `${(val / 1000).toFixed(1)}k`;
    }
    return val;
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography color="text.secondary" gutterBottom variant="overline">
              {title}
            </Typography>
            <Typography variant="h4" component="div">
              {formatValue(value)}
            </Typography>
            {trend !== undefined && (
              <Typography variant="body2" sx={{ color: trend > 0 ? 'success.main' : 'error.main', mt: 1 }}>
                {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
              </Typography>
            )}
          </Box>
          <Box sx={{ backgroundColor: color, borderRadius: 1, p: 1, color: 'white' }}>
            {React.cloneElement(icon, { sx: { fontSize: 32 } })}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatCard;
