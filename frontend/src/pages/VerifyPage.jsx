import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import LoadingButton from '../components/common/LoadingButton';
import api from '../services/api';

const VerifyPage = () => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const inputRefs = useRef([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      toast.error('Email not found. Redirecting to signup...');
      navigate('/signup');
    }
  }, [email, navigate]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    
    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const verificationCode = code.join('');
    if (verificationCode.length !== 6) {
      return toast.error('Please enter the 6-digit code');
    }

    setLoading(true);
    try {
      const { data } = await api.post('/auth/verify-email', { email, code: verificationCode });
      toast.success(data.message);
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      const { data } = await api.post('/auth/resend-code', { email });
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to resend code');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="glass-card animate-fade-in">
      <h1>Verify Email</h1>
      <p className="subtitle">Enter the 6-digit code sent to <b>{email}</b></p>
      
      <form onSubmit={handleSubmit}>
        <div className="verify-slots">
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              required
            />
          ))}
        </div>

        <LoadingButton loading={loading}>
          Verify Account
        </LoadingButton>
      </form>

      <p className="link-text">
        Didn't receive the code?{' '}
        <button 
          onClick={handleResend} 
          disabled={resending} 
          style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '600', cursor: 'pointer', padding: 0 }}
        >
          {resending ? 'Resending...' : 'Resend Code'}
        </button>
      </p>
    </div>
  );
};

export default VerifyPage;
