import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaHome, FaUser, FaServer, FaSignOutAlt, FaCube } from 'react-icons/fa';
import { useAuth } from '../utils/AuthContext';
import { theme, Flex, Button } from '../styles/GlobalStyles';

const Nav = styled(motion.nav)`
  background: rgba(26, 26, 26, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid ${theme.colors.border};
  padding: 16px 0;
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const NavContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 0 16px;
  }
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: ${theme.colors.light};
  font-size: 20px;
  font-weight: 700;
`;

const LogoIcon = styled(motion.div)`
  color: ${theme.colors.primary};
  font-size: 24px;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 32px;
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    gap: 16px;
  }
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${theme.colors.light};
  text-decoration: none;
  padding: 8px 16px;
  border-radius: ${theme.borderRadius.medium};
  transition: all 0.3s ease;
  font-weight: 500;
  
  &:hover {
    background: rgba(74, 144, 226, 0.1);
    color: ${theme.colors.primary};
  }
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    span {
      display: none;
    }
  }
`;

const UserMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const UserInfo = styled.div`
  color: ${theme.colors.light};
  font-weight: 500;
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    display: none;
  }
`;

const LogoutButton = styled(Button)`
  padding: 8px 16px;
  font-size: 14px;
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 8px;
    span {
      display: none;
    }
  }
`;

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <NavContainer>
        <Logo to="/">
          <LogoIcon
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <FaCube />
          </LogoIcon>
          MCHostPanel
        </Logo>

        {isAuthenticated ? (
          <>
            <NavLinks>
              <NavLink to="/dashboard">
                <FaServer />
                <span>Dashboard</span>
              </NavLink>
              <NavLink to="/account">
                <FaUser />
                <span>Account</span>
              </NavLink>
            </NavLinks>

            <UserMenu>
              <UserInfo>Welcome, {user?.username}</UserInfo>
              <LogoutButton onClick={handleLogout}>
                <FaSignOutAlt />
                <span>Logout</span>
              </LogoutButton>
            </UserMenu>
          </>
        ) : (
          <Flex gap="16px">
            <Button as={Link} to="/login" variant="secondary">
              Login
            </Button>
            <Button as={Link} to="/register">
              Get Started
            </Button>
          </Flex>
        )}
      </NavContainer>
    </Nav>
  );
};

export default Navbar;