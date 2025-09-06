import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaServer, FaCube, FaGamepad } from 'react-icons/fa';
import { theme } from '../styles/GlobalStyles';

const AnimatedBackground = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${theme.gradients.background};
  z-index: -2;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      radial-gradient(circle at 20% 50%, rgba(74, 144, 226, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(46, 204, 113, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 80%, rgba(243, 156, 18, 0.1) 0%, transparent 50%);
    animation: float 6s ease-in-out infinite;
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
  }
`;

const FloatingIcon = styled(motion.div)`
  position: absolute;
  color: ${props => props.color || theme.colors.primary};
  font-size: ${props => props.size || '20px'};
  opacity: 0.3;
  z-index: -1;
`;

const MinecraftBackground = () => {
  const icons = [
    { Icon: FaServer, color: theme.colors.primary, size: '24px', top: '10%', left: '10%' },
    { Icon: FaCube, color: theme.colors.secondary, size: '20px', top: '20%', left: '80%' },
    { Icon: FaGamepad, color: theme.colors.warning, size: '18px', top: '70%', left: '15%' },
    { Icon: FaServer, color: theme.colors.danger, size: '22px', top: '60%', left: '85%' },
    { Icon: FaCube, color: theme.colors.primary, size: '16px', top: '30%', left: '50%' },
    { Icon: FaGamepad, color: theme.colors.secondary, size: '20px', top: '80%', left: '70%' },
  ];

  return (
    <>
      <AnimatedBackground
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      />
      {icons.map((item, index) => (
        <FloatingIcon
          key={index}
          color={item.color}
          size={item.size}
          style={{ top: item.top, left: item.left }}
          initial={{ y: 0, opacity: 0 }}
          animate={{ 
            y: [-10, 10, -10],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            duration: 4 + index,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.5
          }}
        >
          <item.Icon />
        </FloatingIcon>
      ))}
    </>
  );
};

export default MinecraftBackground;