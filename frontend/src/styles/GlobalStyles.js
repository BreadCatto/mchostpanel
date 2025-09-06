import styled, { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 100%);
    color: #ffffff;
    min-height: 100vh;
  }

  code {
    font-family: 'JetBrains Mono', source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }

  #root {
    min-height: 100vh;
  }

  /* Scrollbar Styles */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #1a1a1a;
  }

  ::-webkit-scrollbar-thumb {
    background: #4a90e2;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #5ba3f5;
  }
`;

export const theme = {
  colors: {
    primary: '#4a90e2',
    primaryHover: '#5ba3f5',
    secondary: '#2ecc71',
    danger: '#e74c3c',
    warning: '#f39c12',
    dark: '#1a1a1a',
    darker: '#0c0c0c',
    light: '#ffffff',
    gray: '#6c757d',
    lightGray: '#e9ecef',
    background: '#0c0c0c',
    surface: '#1a1a1a',
    border: '#333333',
  },
  gradients: {
    primary: 'linear-gradient(135deg, #4a90e2 0%, #5ba3f5 100%)',
    background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 100%)',
    minecraft: 'linear-gradient(45deg, #4a90e2, #2ecc71, #f39c12, #e74c3c)',
  },
  shadows: {
    small: '0 2px 4px rgba(0, 0, 0, 0.1)',
    medium: '0 4px 8px rgba(0, 0, 0, 0.15)',
    large: '0 8px 16px rgba(0, 0, 0, 0.2)',
    glow: '0 0 20px rgba(74, 144, 226, 0.3)',
  },
  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '12px',
    xl: '16px',
  },
  breakpoints: {
    mobile: '768px',
    tablet: '1024px',
    desktop: '1200px',
  },
};

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 0 16px;
  }
`;

export const Card = styled.div`
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.large};
  padding: 24px;
  box-shadow: ${theme.shadows.medium};
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.large};
  }
`;

export const Button = styled.button`
  background: ${props => props.variant === 'secondary' ? 'transparent' : theme.gradients.primary};
  color: ${props => props.variant === 'secondary' ? theme.colors.primary : theme.colors.light};
  border: ${props => props.variant === 'secondary' ? `2px solid ${theme.colors.primary}` : 'none'};
  padding: 12px 24px;
  border-radius: ${theme.borderRadius.medium};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.glow};
    background: ${props => props.variant === 'secondary' ? theme.colors.primary : theme.gradients.primary};
    color: ${theme.colors.light};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
  
  ${props => props.size === 'large' && `
    padding: 16px 32px;
    font-size: 16px;
  `}
  
  ${props => props.size === 'small' && `
    padding: 8px 16px;
    font-size: 12px;
  `}
`;

export const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  background: ${theme.colors.darker};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.medium};
  color: ${theme.colors.light};
  font-size: 14px;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
  }
  
  &::placeholder {
    color: ${theme.colors.gray};
  }
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: ${theme.colors.light};
  font-weight: 500;
  font-size: 14px;
`;

export const FormGroup = styled.div`
  margin-bottom: 20px;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: ${props => props.columns || 'repeat(auto-fit, minmax(300px, 1fr))'};
  gap: ${props => props.gap || '24px'};
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

export const Flex = styled.div`
  display: flex;
  align-items: ${props => props.align || 'center'};
  justify-content: ${props => props.justify || 'flex-start'};
  gap: ${props => props.gap || '16px'};
  flex-direction: ${props => props.direction || 'row'};
  flex-wrap: ${props => props.wrap || 'nowrap'};
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    flex-direction: ${props => props.mobileDirection || props.direction || 'column'};
    gap: 12px;
  }
`;

export const Text = styled.p`
  color: ${props => props.color || theme.colors.light};
  font-size: ${props => props.size || '14px'};
  font-weight: ${props => props.weight || '400'};
  margin: ${props => props.margin || '0'};
  text-align: ${props => props.align || 'left'};
  line-height: 1.5;
`;

export const Title = styled.h1`
  color: ${theme.colors.light};
  font-size: ${props => props.size || '32px'};
  font-weight: 700;
  margin: ${props => props.margin || '0 0 24px 0'};
  text-align: ${props => props.align || 'left'};
  background: ${theme.gradients.minecraft};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${props => props.mobileSize || '24px'};
  }
`;

export const Subtitle = styled.h2`
  color: ${theme.colors.light};
  font-size: ${props => props.size || '24px'};
  font-weight: 600;
  margin: ${props => props.margin || '0 0 16px 0'};
  text-align: ${props => props.align || 'left'};
`;

export const Loading = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: ${props => props.height || '200px'};
  color: ${theme.colors.gray};
  font-size: 16px;
`;

export const ErrorMessage = styled.div`
  color: ${theme.colors.danger};
  font-size: 14px;
  margin-top: 8px;
  padding: 12px;
  background: rgba(231, 76, 60, 0.1);
  border-radius: ${theme.borderRadius.medium};
  border: 1px solid rgba(231, 76, 60, 0.3);
`;

export const SuccessMessage = styled.div`
  color: ${theme.colors.secondary};
  font-size: 14px;
  margin-top: 8px;
  padding: 12px;
  background: rgba(46, 204, 113, 0.1);
  border-radius: ${theme.borderRadius.medium};
  border: 1px solid rgba(46, 204, 113, 0.3);
`;