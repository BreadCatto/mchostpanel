import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock, FaSave, FaEdit } from 'react-icons/fa';
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
  Flex,
  Grid
} from '../styles/GlobalStyles';
import { theme } from '../styles/GlobalStyles';
import { userAPI } from '../services/api';
import { useAuth } from '../utils/AuthContext';
import { toast } from 'react-toastify';
import MinecraftBackground from '../components/MinecraftBackground';

const AccountContainer = styled.div`
  min-height: 100vh;
  padding: 40px 0;
`;

const ProfileSection = styled(Card)`
  margin-bottom: 32px;
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
`;

const Avatar = styled.div`
  width: 80px;
  height: 80px;
  background: ${theme.gradients.primary};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: white;
  font-weight: 700;
  margin-right: 24px;
`;

const ProfileInfo = styled.div`
  flex: 1;
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

const InfoCard = styled(Card)`
  background: ${theme.gradients.primary};
  border: none;
  color: white;
  text-align: center;
`;

const InfoNumber = styled.div`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
`;

const InfoLabel = styled.div`
  font-size: 14px;
  opacity: 0.9;
`;

const Account = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState({
    username: '',
    email: ''
  });
  const [passwordData, setPasswordData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setProfile({
        username: user.username,
        email: user.email
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
    if (success) setSuccess('');
  };

  const validatePasswordUpdate = () => {
    if (passwordData.password !== passwordData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (passwordData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    return true;
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const updateData = {
        username: profile.username,
        email: profile.email
      };

      // Include password if provided
      if (passwordData.password) {
        if (!validatePasswordUpdate()) {
          setLoading(false);
          return;
        }
        updateData.password = passwordData.password;
      }

      await userAPI.updateProfile(updateData);
      setSuccess('Profile updated successfully!');
      toast.success('Profile updated successfully!');
      setEditMode(false);
      setPasswordData({ password: '', confirmPassword: '' });
      
      // If username changed, user needs to re-login
      if (updateData.username !== user.username) {
        toast.info('Username changed. Please log in again.');
        setTimeout(() => {
          logout();
        }, 2000);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Failed to update profile';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      <MinecraftBackground />
      <AccountContainer>
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Title margin="0 0 40px 0">Account Settings</Title>

            <Grid columns="2fr 1fr" gap="32px">
              <div>
                {/* Profile Information */}
                <ProfileSection>
                  <ProfileHeader>
                    <Avatar>
                      {user?.username?.charAt(0).toUpperCase()}
                    </Avatar>
                    <ProfileInfo>
                      <Title size="24px" margin="0 0 8px 0">
                        {user?.username}
                      </Title>
                      <Text color={theme.colors.gray}>
                        Member since {user?.created_at ? formatDate(user.created_at) : 'N/A'}
                      </Text>
                    </ProfileInfo>
                    <Button 
                      onClick={() => setEditMode(!editMode)}
                      variant="secondary"
                    >
                      <FaEdit /> {editMode ? 'Cancel' : 'Edit Profile'}
                    </Button>
                  </ProfileHeader>

                  {editMode ? (
                    <form onSubmit={handleUpdateProfile}>
                      <InputGroup>
                        <Label>Username</Label>
                        <div style={{ position: 'relative' }}>
                          <InputIcon>
                            <FaUser />
                          </InputIcon>
                          <StyledInput
                            type="text"
                            name="username"
                            placeholder="Enter username"
                            value={profile.username}
                            onChange={handleProfileChange}
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
                            placeholder="Enter email"
                            value={profile.email}
                            onChange={handleProfileChange}
                            required
                          />
                        </div>
                      </InputGroup>

                      <Title size="20px" margin="32px 0 16px 0">
                        Change Password (Optional)
                      </Title>

                      <InputGroup>
                        <Label>New Password</Label>
                        <div style={{ position: 'relative' }}>
                          <InputIcon>
                            <FaLock />
                          </InputIcon>
                          <StyledInput
                            type="password"
                            name="password"
                            placeholder="Enter new password"
                            value={passwordData.password}
                            onChange={handlePasswordChange}
                          />
                        </div>
                      </InputGroup>

                      <InputGroup>
                        <Label>Confirm New Password</Label>
                        <div style={{ position: 'relative' }}>
                          <InputIcon>
                            <FaLock />
                          </InputIcon>
                          <StyledInput
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm new password"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                          />
                        </div>
                      </InputGroup>

                      {error && <ErrorMessage>{error}</ErrorMessage>}
                      {success && <SuccessMessage>{success}</SuccessMessage>}

                      <Flex gap="12px" style={{ marginTop: '24px' }}>
                        <Button type="submit" disabled={loading}>
                          <FaSave /> {loading ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Button 
                          type="button" 
                          variant="secondary" 
                          onClick={() => setEditMode(false)}
                        >
                          Cancel
                        </Button>
                      </Flex>
                    </form>
                  ) : (
                    <div>
                      <FormGroup>
                        <Label>Username</Label>
                        <Text>{user?.username}</Text>
                      </FormGroup>
                      <FormGroup>
                        <Label>Email</Label>
                        <Text>{user?.email}</Text>
                      </FormGroup>
                      <FormGroup>
                        <Label>Account Status</Label>
                        <Text color={user?.is_active ? theme.colors.secondary : theme.colors.danger}>
                          {user?.is_active ? 'Active' : 'Inactive'}
                        </Text>
                      </FormGroup>
                    </div>
                  )}
                </ProfileSection>
              </div>

              <div>
                {/* Account Statistics */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <InfoCard style={{ marginBottom: '24px' }}>
                    <InfoNumber>{user?.pterodactyl_id || 'N/A'}</InfoNumber>
                    <InfoLabel>Pterodactyl User ID</InfoLabel>
                  </InfoCard>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <InfoCard style={{ marginBottom: '24px' }}>
                    <InfoNumber>{user?.is_admin ? 'Yes' : 'No'}</InfoNumber>
                    <InfoLabel>Administrator</InfoLabel>
                  </InfoCard>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <Card>
                    <Title size="18px" margin="0 0 16px 0">
                      Account Security
                    </Title>
                    <Text size="14px" color={theme.colors.gray} margin="0 0 16px 0">
                      Your account is secured with encrypted passwords and secure authentication tokens.
                    </Text>
                    <Button 
                      onClick={logout}
                      variant="secondary"
                      style={{ 
                        width: '100%',
                        borderColor: theme.colors.danger,
                        color: theme.colors.danger
                      }}
                    >
                      Sign Out of All Devices
                    </Button>
                  </Card>
                </motion.div>
              </div>
            </Grid>
          </motion.div>
        </Container>
      </AccountContainer>
    </>
  );
};

export default Account;