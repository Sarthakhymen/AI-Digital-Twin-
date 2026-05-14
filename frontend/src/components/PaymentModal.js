import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, CheckCircle2, QrCode, Copy, Check } from 'lucide-react';
import axios from 'axios';

const PaymentModal = ({ isOpen, onClose, plan, userEmail }) => {
  const [paymentStep, setPaymentStep] = useState('qr'); // qr, verify
  const [transactionId, setTransactionId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const upiId = "9625410112@nyes";

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!transactionId) {
      setMessage({ type: 'error', text: 'Please enter transaction ID' });
      return;
    }

    setSubmitting(true);
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/payments/manual-submit`, {
        transaction_id: transactionId,
        email: userEmail
      });

      // Backend returns {"message": "Payment details submitted successfully..."}
      if (response.data && response.data.message) {
        setPaymentStep('success');
        setMessage({ type: 'success', text: 'Payment details submitted! We will verify and activate your premium status shortly.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.detail || 'Failed to submit payment details' });
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white">{plan?.name} Plan</h3>
            <p className="text-sm text-slate-400">Complete payment to unlock premium features</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-xl transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="p-8">
          {paymentStep === 'qr' && (
            <div className="space-y-6 text-center">
              <div className="relative mx-auto w-48 h-48 p-4 bg-white rounded-2xl shadow-xl">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=${upiId}%26pn=AI%20Digital%20Twin%26am=${plan?.price.replace('₹', '').replace(',', '')}%26cu=INR`}
                  alt="Payment QR"
                  className="w-full h-full"
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
                  <QrCode className="w-24 h-24 text-slate-900" />
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-2xl font-bold text-white">{plan?.price}</p>
                <div className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-800/50 rounded-xl border border-slate-700 w-fit mx-auto">
                  <code className="text-rose-400 font-mono">{upiId}</code>
                  <button onClick={handleCopyUPI} className="p-1 hover:text-white text-slate-400 transition-colors">
                    {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-left">
                <p className="text-xs text-blue-400 leading-relaxed font-medium">
                  1. Scan the QR code using any UPI app (GPay, PhonePe, Paytm)<br />
                  2. Make the payment of {plan?.price}<br />
                  3. Note down the Transaction ID / UTR Number
                </p>
              </div>

              <button
                onClick={() => setPaymentStep('verify')}
                className="w-full py-4 bg-gradient-to-r from-rose-500 to-red-600 text-white rounded-xl font-bold hover:from-rose-600 hover:to-red-700 transition-all shadow-lg shadow-rose-500/20 flex items-center justify-center gap-2"
              >
                I have made the payment
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {paymentStep === 'verify' && (
            <form onSubmit={handlePaymentSubmit} className="space-y-6">
              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-300">
                  Enter Transaction ID / UTR Number
                </label>
                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="12-digit transaction ID"
                  className="w-full px-4 py-4 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              {message.text && (
                <div className={`p-4 rounded-xl text-sm ${message.type === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'}`}>
                  {message.text}
                </div>
              )}

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentStep('qr')}
                  className="flex-1 py-4 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-700 transition-all"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-[2] py-4 bg-gradient-to-r from-rose-500 to-red-600 text-white rounded-xl font-bold hover:from-rose-600 hover:to-red-700 transition-all shadow-lg shadow-rose-500/20 disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Verify Payment'}
                </button>
              </div>
            </form>
          )}

          {paymentStep === 'success' && (
            <div className="text-center space-y-6 py-4">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-white">Submission Successful!</h3>
                <p className="text-slate-400">
                  Our team will verify your transaction ID. Your premium features will be unlocked within 2-4 hours.
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-full py-4 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-700 transition-all"
              >
                Close Window
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

// Helper component for ChevronRight which is needed in QR step
const ChevronRight = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

export default PaymentModal;
