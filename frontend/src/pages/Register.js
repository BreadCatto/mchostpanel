import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock, FaUserPlus } from 'react-icons/fa';
import { useAuth } from '../utils/AuthContext';
import { 
  Container, 
  Card, 
  Title, 
  Text, 
  Button, 
  Input, 
  Label, 
  FormGroup, 
  ErrorMessage,
  SuccessMessage,
  Flex 
} from '../styles/GlobalStyles';
import MinecraftBackground from '../components/MinecraftBackground';
import { toast } from 'react-toastify';

const RegisterContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
`;

const RegisterCard = styled(Card)`
  width: 100%;
  max-width: 400px;
  text-align: center;
`;

const IconWrapper = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #4a90e2 0%, #5ba3f5 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px auto;
  font-size: 24px;
  color: white;
`;

const InputGroup = styled.div`
  position: relative;
  margin-bottom: 20px;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
  z-index: 1;
`;

const StyledInput = styled(Input)`
  padding-left: 48px;
`;

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
    if (success) setSuccess('');
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (formData.username.length < 3) {
      setError('Username must be at least 3 characters long');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');

    const result = await register({
      username: formData.username,
      email: formData.email,
      password: formData.password
    });
    
    if (result.success) {
      setSuccess('Account created successfully! You can now log in.');
      toast.success('Account created successfully!');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <>
      <MinecraftBackground />
      <RegisterContainer>
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <RegisterCard>
              <IconWrapper>
                <FaUserPlus />
              </IconWrapper>
              
              <Title size="28px" margin="0 0 8px 0">Create Account</Title>
              <Text color="#6c757d" margin="0 0 32px 0">
                Join MCHostPanel and start your Minecraft journey
              </Text>

              <form onSubmit={handleSubmit}>
                <InputGroup>
                  <Label>Username</Label>
                  <div style={{ position: 'relative' }}>
                    <InputIcon>
                      <FaUser />
                    </InputIcon>
                    <StyledInput
                      type="text"
                      name="username"
                      placeholder="Choose a username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </InputGroup>

                <InputGroup>
                  <Label>Email</Label>
                  <div style={{ position: 'relative' }}>
                    <InputIcon>
                      <FaEnvelope />
                    </InputIcon>
                    <StyledInput
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </InputGroup>

                <InputGroup>
                  <Label>Password</Label>
                  <div style={{ position: 'relative' }}>
                    <InputIcon>
                      <FaLock />
                    </InputIcon>
                    <StyledInput
                      type="password"
                      name="password"
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </InputGroup>

                <InputGroup>
                  <Label>Confirm Password</Label>
                  <div style={{ position: 'relative' }}>
                    <InputIcon>
                      <FaLock />
                    </InputIcon>
                    <StyledInput
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </InputGroup>

                {error && <ErrorMessage>{error}</ErrorMessage>}
                {success && <SuccessMessage>{success}</SuccessMessage>}

                <Button 
                  type="submit" 
                  disabled={loading}
                  style={{ width: '100%', marginTop: '24px' }}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </form>

              <Flex justify="center" style={{ marginTop: '24px' }}>
                <Text>
                  Already have an account?{' '}
                  <Link 
                    to="/login" 
                    style={{ 
                      color: '#4a90e2', 
                      textDecoration: 'none',
                      fontWeight: '500'
                    }}
                  >
                    Sign in
                  </Link>
                </Text>
              </Flex>
            </RegisterCard>
          </motion.div>
        </Container>
      </RegisterContainer>
    </>
  );
};

export default Register;