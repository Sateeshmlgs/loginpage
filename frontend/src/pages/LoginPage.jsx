import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import InputField from '../components/common/InputField';
import LoadingButton from '../components/common/LoadingButton';
import api from '../services/api';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await api.post('/auth/login', formData);
      login(data.data.user, data.data.token);
      toast.success(data.message);
      navigate('/dashboard');
    } catch (error) {
      if (error.response?.data?.message === 'Please verify your email first') {

        navigate('/verify', { state: { email: formData.email } });
      } else {
        toast.error(error.response?.data?.message || 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card animate-fade-in">
      <h1>Welcome Back</h1>
      <p className="subtitle">Please enter your details to sign in</p>
      
      <form onSubmit={handleSubmit}>
        <InputField
          label="Email Address"
          name="email"
          type="email"
          placeholder="your@email.com"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <InputField
          label="Password"
          name="password"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <LoadingButton loading={loading}>
          Sign In
        </LoadingButton>
      </form>

      <p className="link-text">
        Don't have an account? <Link to="/signup">Sign up</Link>
      </p>
    </div>
  );
};

export default LoginPage;
