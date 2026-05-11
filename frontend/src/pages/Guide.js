import React from 'react';
import { 
  Box, Typography, Container, Stepper, Step, StepLabel, 
  StepContent, Button, Paper, Divider, Grid, Card
} from '@mui/material';
import { 
  Login, 
  PersonAdd, 
  Psychology, 
  SettingsSuggest, 
  Code,
  CheckCircle,
  IntegrationInstructions
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';

const steps = [
  {
    label: 'Login or Signup',
    description: `Start by creating your account or signing in. We support Google OAuth for a seamless experience. Once logged in, you'll be redirected to your dashboard.`,
    icon: <Login sx={{ color: '#6366F1' }} />,
    details: 'You can use your professional email or Google account.'
  },
  {
    label: 'Create Your AI Digital Twin',
    description: `Click on 'Create New Twin'. Give your twin a name (e.g., "Sarthak AI") and define its role (e.g., "Customer Support Specialist"). This sets the base behavior.`,
    icon: <PersonAdd sx={{ color: '#8B5CF6' }} />,
    details: 'Set the tone: Professional, Friendly, or Tech-savvy.'
  },
  {
    label: 'Feed Knowledge (Training)',
    description: `Upload your business documents (PDF, DOCX) or paste website URLs. Our AI will process this data to understand your business inside out.`,
    icon: <Psychology sx={{ color: '#EC4899' }} />,
    details: 'The more data you provide, the smarter your twin becomes.'
  },
  {
    label: 'Customize Appearance',
    description: `Head to the settings to customize your chat widget. Change colors, add your brand logo, and write a custom welcome message that represents you.`,
    icon: <SettingsSuggest sx={{ color: '#F59E0B' }} />,
    details: 'Match your website\'s design perfectly.'
  },
  {
    label: 'Integrate the Script',
    description: `This is the final step. Copy the generated <script> tag from your dashboard and paste it into your website's HTML file, right before the closing </body> tag.`,
    icon: <Code sx={{ color: '#10B981' }} />,
    details: 'Works with React, Webflow, WordPress, and basic HTML.'
  }
];

const Guide = () => {
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Box sx={{ bgcolor: '#0F172A', minHeight: '100vh', color: 'white', pb: 10 }}>
      <Navbar />
      
      <Container maxWidth="lg" sx={{ pt: 12 }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Typography variant="overline" sx={{ color: '#6366F1', fontWeight: 700, letterSpacing: 2 }}>
              ONBOARDING GUIDE
            </Typography>
            <Typography variant="h2" sx={{ fontWeight: 900, mb: 3, background: 'linear-gradient(to right, #FFF, #94A3B8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              How to Launch your Twin.
            </Typography>
            <Typography variant="h6" sx={{ color: '#94A3B8', mb: 4, maxWidth: '700px', mx: 'auto' }}>
              Follow these simple steps to go from a new user to having a fully functional AI Digital Twin on your website.
            </Typography>
          </motion.div>
        </Box>

        <Grid container spacing={6}>
          <Grid item xs={12} md={7}>
            <Box sx={{ maxWidth: 600 }}>
              <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((step, index) => (
                  <Step key={step.label}>
                    <StepLabel
                      StepIconComponent={() => (
                        <Box sx={{ 
                          width: 40, height: 40, borderRadius: '50%', 
                          bgcolor: activeStep === index ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255,255,255,0.05)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          border: activeStep === index ? '2px solid #6366F1' : '1px solid rgba(255,255,255,0.1)',
                          transition: 'all 0.3s ease'
                        }}>
                          {step.icon}
                        </Box>
                      )}
                    >
                      <Typography variant="h6" sx={{ color: activeStep === index ? 'white' : '#94A3B8', fontWeight: 700, ml: 1 }}>
                        {step.label}
                      </Typography>
                    </StepLabel>
                    <StepContent>
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                      >
                        <Typography sx={{ color: '#CBD5E1', mb: 2, fontSize: '1.1rem', lineHeight: 1.6 }}>
                          {step.description}
                        </Typography>
                        <Box sx={{ 
                          bgcolor: 'rgba(99, 102, 241, 0.1)', 
                          p: 2, borderRadius: '12px', mb: 3, 
                          borderLeft: '4px solid #6366F1' 
                        }}>
                          <Typography variant="body2" sx={{ color: '#A5B4FC', fontWeight: 600 }}>
                            PRO TIP: {step.details}
                          </Typography>
                        </Box>
                        <Box sx={{ mb: 2 }}>
                          <Button
                            variant="contained"
                            onClick={handleNext}
                            sx={{ 
                              mt: 1, mr: 1, bgcolor: '#6366F1', borderRadius: '8px', px: 3,
                              '&:hover': { bgcolor: '#4F46E5' }
                            }}
                          >
                            {index === steps.length - 1 ? 'Finish' : 'Continue'}
                          </Button>
                          <Button
                            disabled={index === 0}
                            onClick={handleBack}
                            sx={{ mt: 1, mr: 1, color: '#94A3B8' }}
                          >
                            Back
                          </Button>
                        </Box>
                      </motion.div>
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
              {activeStep === steps.length && (
                <Paper square elevation={0} sx={{ p: 4, bgcolor: 'rgba(16, 185, 129, 0.1)', borderRadius: '24px', border: '1px solid rgba(16, 185, 129, 0.2)', mt: 4 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <CheckCircle sx={{ fontSize: 60, color: '#10B981', mb: 2 }} />
                    <Typography variant="h5" sx={{ color: 'white', fontWeight: 800, mb: 2 }}>
                      All steps completed!
                    </Typography>
                    <Typography sx={{ color: '#A7F3D0', mb: 3 }}>
                      You are now ready to dominate your niche with your AI Digital Twin.
                    </Typography>
                    <Button onClick={handleReset} variant="outlined" sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.2)' }}>
                      View Steps Again
                    </Button>
                  </Box>
                </Paper>
              )}
            </Box>
          </Grid>

          <Grid item xs={12} md={5}>
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card sx={{ 
                bgcolor: 'rgba(30, 41, 59, 0.5)', 
                backdropFilter: 'blur(20px)',
                borderRadius: '32px',
                border: '1px solid rgba(255,255,255,0.1)',
                overflow: 'hidden',
                p: 4
              }}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
                    {activeStep < steps.length ? `Step ${activeStep + 1} Preview` : 'Deployment Ready'}
                  </Typography>
                  <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
                </Box>

                {activeStep === 4 ? (
                  <Box>
                    <Typography sx={{ color: '#94A3B8', mb: 2 }}>
                      Copy this code into your HTML's <code>&lt;body&gt;</code> tag:
                    </Typography>
                    <Box sx={{ 
                      bgcolor: '#000', p: 3, borderRadius: '16px', 
                      fontFamily: 'monospace', fontSize: '0.9rem',
                      color: '#10B981', border: '1px solid rgba(16, 185, 129, 0.3)',
                      position: 'relative', overflowX: 'auto'
                    }}>
                      <code>
                        {`<script src="https://cdn.twin.ai/widget.js" data-id="YOUR_TWIN_ID"></script>`}
                      </code>
                    </Box>
                    <Button 
                      fullWidth 
                      startIcon={<IntegrationInstructions />}
                      sx={{ mt: 3, bgcolor: '#10B981', color: 'white', py: 1.5, borderRadius: '12px', fontWeight: 800 }}
                    >
                      Copy Integration Code
                    </Button>
                  </Box>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 6 }}>
                    <Box sx={{ 
                      width: 120, height: 120, borderRadius: '50%', 
                      bgcolor: 'rgba(99, 102, 241, 0.1)', mx: 'auto',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      mb: 3
                    }}>
                      {activeStep < steps.length ? steps[activeStep].icon : <CheckCircle sx={{ fontSize: 60, color: '#10B981' }} />}
                    </Box>
                    <Typography variant="h6" sx={{ color: '#CBD5E1' }}>
                      {activeStep < steps.length ? `Working on: ${steps[activeStep].label}` : 'Success!'}
                    </Typography>
                  </Box>
                )}
              </Card>
            </motion.div>

            <Box sx={{ mt: 4, p: 3, bgcolor: 'rgba(245, 158, 11, 0.05)', borderRadius: '24px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
              <Typography variant="subtitle1" sx={{ color: '#F59E0B', fontWeight: 800, mb: 1, display: 'flex', alignItems: 'center' }}>
                Need Help?
              </Typography>
              <Typography variant="body2" sx={{ color: '#D4D4D8' }}>
                Join our Discord community or email support@twincreator.com for 1-on-1 assistance with your deployment.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Guide;
