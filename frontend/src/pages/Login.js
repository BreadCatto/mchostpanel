import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaUser, FaLock, FaSignInAlt } from 'react-icons/fa';
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
  Flex 
} from '../styles/GlobalStyles';
import MinecraftBackground from '../components/MinecraftBackground';
import { toast } from 'react-toastify';

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
`;

const LoginCard = styled(Card)`
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

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData.username, formData.password);
    
    if (result.success) {
      toast.success('Welcome back!');
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <>
      <MinecraftBackground />
      <LoginContainer>
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <LoginCard>
              <IconWrapper>
                <FaSignInAlt />
              </IconWrapper>
              
              <Title size="28px" margin="0 0 8px 0">Welcome Back</Title>
              <Text color="#6c757d" margin="0 0 32px 0">
                Sign in to your MCHostPanel account
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
                      placeholder="Enter your username"
                      value={formData.username}
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
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </InputGroup>

                {error && <ErrorMessage>{error}</ErrorMessage>}

                <Button 
                  type="submit" 
                  disabled={loading}
                  style={{ width: '100%', marginTop: '24px' }}
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </Button>
              </form>

              <Flex justify="center" style={{ marginTop: '24px' }}>
                <Text>
                  Don't have an account?{' '}
                  <Link 
                    to="/register" 
                    style={{ 
                      color: '#4a90e2', 
                      textDecoration: 'none',
                      fontWeight: '500'
                    }}
                  >
                    Sign up
                  </Link>
                </Text>
              </Flex>
            </LoginCard>
          </motion.div>
        </Container>
      </LoginContainer>
    </>
  );
};

export default Login;