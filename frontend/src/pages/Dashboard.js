import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaServer, FaPlus, FaPlay, FaStop, FaRedo, FaTrash, FaCube } from 'react-icons/fa';
import { 
  Container, 
  Card, 
  Title, 
  Text, 
  Button, 
  Grid, 
  Flex, 
  Loading,
  ErrorMessage,
  Input,
  Label,
  FormGroup
} from '../styles/GlobalStyles';
import { theme } from '../styles/GlobalStyles';
import { serverAPI } from '../services/api';
import { toast } from 'react-toastify';
import MinecraftBackground from '../components/MinecraftBackground';

const DashboardContainer = styled.div`
  min-height: 100vh;
  padding: 40px 0;
`;

const StatsGrid = styled(Grid)`
  margin-bottom: 40px;
`;

const StatCard = styled(Card)`
  text-align: center;
  padding: 24px;
  background: ${theme.gradients.primary};
  border: none;
  color: white;
`;

const StatNumber = styled.div`
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 8px;
`;

const StatLabel = styled.div`
  font-size: 14px;
  opacity: 0.9;
`;

const ServerCard = styled(Card)`
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => {
      switch (props.status) {
        case 'running': return theme.colors.secondary;
        case 'stopped': return theme.colors.danger;
        case 'installing': return theme.colors.warning;
        default: return theme.colors.gray;
      }
    }};
  }
`;

const ServerHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const ServerIcon = styled.div`
  width: 48px;
  height: 48px;
  background: ${theme.gradients.primary};
  border-radius: ${theme.borderRadius.medium};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
`;

const ServerInfo = styled.div`
  flex: 1;
  margin-left: 16px;
`;

const ServerName = styled.h3`
  color: ${theme.colors.light};
  margin-bottom: 4px;
  font-size: 18px;
`;

const ServerStatus = styled.span`
  padding: 4px 12px;
  border-radius: ${theme.borderRadius.small};
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  background: ${props => {
    switch (props.status) {
      case 'running': return 'rgba(46, 204, 113, 0.2)';
      case 'stopped': return 'rgba(231, 76, 60, 0.2)';
      case 'installing': return 'rgba(243, 156, 18, 0.2)';
      default: return 'rgba(108, 117, 125, 0.2)';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'running': return theme.colors.secondary;
      case 'stopped': return theme.colors.danger;
      case 'installing': return theme.colors.warning;
      default: return theme.colors.gray;
    }
  }};
`;

const ServerActions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 16px;
`;

const ActionButton = styled(Button)`
  padding: 8px 12px;
  font-size: 12px;
  min-width: auto;
`;

const CreateServerModal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled(Card)`
  width: 100%;
  max-width: 500px;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  color: ${theme.colors.gray};
  font-size: 24px;
  cursor: pointer;
  
  &:hover {
    color: ${theme.colors.light};
  }
`;

const Dashboard = () => {
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [newServer, setNewServer] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    fetchServers();
  }, []);

  const fetchServers = async () => {
    try {
      const response = await serverAPI.getServers();
      setServers(response.data);
    } catch (error) {
      setError('Failed to load servers');
      toast.error('Failed to load servers');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateServer = async (e) => {
    e.preventDefault();
    setCreateLoading(true);

    try {
      await serverAPI.createServer(newServer);
      toast.success('Server created successfully!');
      setShowCreateModal(false);
      setNewServer({ name: '', description: '' });
      fetchServers();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to create server');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleServerAction = async (serverId, action) => {
    try {
      switch (action) {
        case 'start':
          await serverAPI.startServer(serverId);
          toast.success('Server start command sent');
          break;
        case 'stop':
          await serverAPI.stopServer(serverId);
          toast.success('Server stop command sent');
          break;
        case 'restart':
          await serverAPI.restartServer(serverId);
          toast.success('Server restart command sent');
          break;
        case 'delete':
          if (window.confirm('Are you sure you want to delete this server?')) {
            await serverAPI.deleteServer(serverId);
            toast.success('Server deleted successfully');
            fetchServers();
          }
          break;
        default:
          break;
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || `Failed to ${action} server`);
    }
  };

  if (loading) {
    return (
      <>
        <MinecraftBackground />
        <Loading height="100vh">Loading your servers...</Loading>
      </>
    );
  }

  return (
    <>
      <MinecraftBackground />
      <DashboardContainer>
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Flex justify="space-between" align="center" style={{ marginBottom: '40px' }}>
              <Title margin="0">Server Dashboard</Title>
              <Button onClick={() => setShowCreateModal(true)}>
                <FaPlus /> Create Server
              </Button>
            </Flex>

            <StatsGrid columns="repeat(auto-fit, minmax(200px, 1fr))">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <StatCard>
                  <StatNumber>{servers.length}</StatNumber>
                  <StatLabel>Total Servers</StatLabel>
                </StatCard>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <StatCard>
                  <StatNumber>{servers.filter(s => s.status === 'running').length}</StatNumber>
                  <StatLabel>Running</StatLabel>
                </StatCard>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <StatCard>
                  <StatNumber>{servers.filter(s => s.status === 'stopped').length}</StatNumber>
                  <StatLabel>Stopped</StatLabel>
                </StatCard>
              </motion.div>
            </StatsGrid>

            {error && <ErrorMessage>{error}</ErrorMessage>}

            {servers.length === 0 ? (
              <Card style={{ textAlign: 'center', padding: '60px 40px' }}>
                <FaServer style={{ fontSize: '48px', color: theme.colors.gray, marginBottom: '20px' }} />
                <Title size="24px" margin="0 0 16px 0">No servers yet</Title>
                <Text color={theme.colors.gray} margin="0 0 24px 0">
                  Create your first Minecraft server to get started
                </Text>
                <Button onClick={() => setShowCreateModal(true)}>
                  <FaPlus /> Create Your First Server
                </Button>
              </Card>
            ) : (
              <Grid>
                {servers.map((server, index) => (
                  <motion.div
                    key={server.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <ServerCard status={server.status}>
                      <ServerHeader>
                        <Flex align="center" style={{ flex: 1 }}>
                          <ServerIcon>
                            <FaCube />
                          </ServerIcon>
                          <ServerInfo>
                            <ServerName>{server.name}</ServerName>
                            <Text size="14px" color={theme.colors.gray}>
                              {server.description || 'No description'}
                            </Text>
                          </ServerInfo>
                        </Flex>
                        <ServerStatus status={server.status}>
                          {server.status}
                        </ServerStatus>
                      </ServerHeader>

                      <ServerActions>
                        <ActionButton
                          onClick={() => handleServerAction(server.id, 'start')}
                          style={{ background: theme.colors.secondary }}
                        >
                          <FaPlay />
                        </ActionButton>
                        <ActionButton
                          onClick={() => handleServerAction(server.id, 'stop')}
                          style={{ background: theme.colors.danger }}
                        >
                          <FaStop />
                        </ActionButton>
                        <ActionButton
                          onClick={() => handleServerAction(server.id, 'restart')}
                          style={{ background: theme.colors.warning }}
                        >
                          <FaRedo />
                        </ActionButton>
                        <ActionButton
                          onClick={() => handleServerAction(server.id, 'delete')}
                          variant="secondary"
                          style={{ borderColor: theme.colors.danger, color: theme.colors.danger }}
                        >
                          <FaTrash />
                        </ActionButton>
                      </ServerActions>
                    </ServerCard>
                  </motion.div>
                ))}
              </Grid>
            )}
          </motion.div>
        </Container>
      </DashboardContainer>

      {showCreateModal && (
        <CreateServerModal
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ModalContent>
              <CloseButton onClick={() => setShowCreateModal(false)}>
                ×
              </CloseButton>
              
              <Title size="24px" margin="0 0 24px 0">Create New Server</Title>
              
              <form onSubmit={handleCreateServer}>
                <FormGroup>
                  <Label>Server Name</Label>
                  <Input
                    type="text"
                    placeholder="Enter server name"
                    value={newServer.name}
                    onChange={(e) => setNewServer({ ...newServer, name: e.target.value })}
                    required
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label>Description (Optional)</Label>
                  <Input
                    type="text"
                    placeholder="Enter server description"
                    value={newServer.description}
                    onChange={(e) => setNewServer({ ...newServer, description: e.target.value })}
                  />
                </FormGroup>
                
                <Flex justify="flex-end" gap="12px">
                  <Button 
                    type="button" 
                    variant="secondary" 
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createLoading}>
                    {createLoading ? 'Creating...' : 'Create Server'}
                  </Button>
                </Flex>
              </form>
            </ModalContent>
          </motion.div>
        </CreateServerModal>
      )}
    </>
  );
};

export default Dashboard;