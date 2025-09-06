import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaRocket, FaShield, FaCube, FaArrowRight } from 'react-icons/fa';
import { Container, Title, Text, Button, Card, Grid, Flex } from '../styles/GlobalStyles';
import { theme } from '../styles/GlobalStyles';
import MinecraftBackground from '../components/MinecraftBackground';

const HeroSection = styled(motion.section)`
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
  padding: 80px 0;
`;

const HeroContent = styled(motion.div)`
  max-width: 800px;
  margin: 0 auto;
`;

const HeroTitle = styled(Title)`
  font-size: 48px;
  margin-bottom: 24px;
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 32px;
  }
`;

const HeroSubtitle = styled(Text)`
  font-size: 20px;
  margin-bottom: 40px;
  color: ${theme.colors.gray};
  line-height: 1.6;
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 18px;
    margin-bottom: 32px;
  }
`;

const FeatureCard = styled(Card)`
  text-align: center;
  padding: 32px 24px;
  
  &:hover {
    transform: translateY(-4px);
  }
`;

const FeatureIcon = styled(motion.div)`
  font-size: 48px;
  color: ${theme.colors.primary};
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
`;

const FeatureTitle = styled.h3`
  font-size: 20px;
  margin-bottom: 16px;
  color: ${theme.colors.light};
`;

const FeatureDescription = styled(Text)`
  color: ${theme.colors.gray};
  line-height: 1.6;
`;

const FeaturesSection = styled.section`
  padding: 80px 0;
`;

const CTASection = styled.section`
  padding: 80px 0;
  text-align: center;
`;

const CTACard = styled(Card)`
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
  background: ${theme.gradients.primary};
  border: none;
`;

const features = [
  {
    icon: FaRocket,
    title: 'Lightning Fast',
    description: 'Deploy your Minecraft server in seconds with our optimized infrastructure and automated setup process.'
  },
  {
    icon: FaShield,
    title: 'Secure & Reliable',
    description: 'Enterprise-grade security with 99.9% uptime guarantee. Your servers are protected with advanced DDoS protection.'
  },
  {
    icon: FaCube,
    title: 'Easy Management',
    description: 'Intuitive control panel with one-click server management, real-time monitoring, and automated backups.'
  }
];

const Home = () => {
  return (
    <>
      <MinecraftBackground />
      
      <HeroSection
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Container>
          <HeroContent>
            <HeroTitle
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Professional Minecraft Server Hosting
            </HeroTitle>
            <HeroSubtitle
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Experience the power of professional-grade Minecraft hosting with our intuitive control panel. 
              Deploy, manage, and scale your servers with ease.
            </HeroSubtitle>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Flex justify="center" gap="20px" mobileDirection="column">
                <Button as={Link} to="/register" size="large">
                  Get Started <FaArrowRight />
                </Button>
                <Button as={Link} to="/login" variant="secondary" size="large">
                  Sign In
                </Button>
              </Flex>
            </motion.div>
          </HeroContent>
        </Container>
      </HeroSection>

      <FeaturesSection>
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Title align="center" margin="0 0 60px 0">
              Why Choose MCHostPanel?
            </Title>
            <Grid columns="repeat(auto-fit, minmax(300px, 1fr))">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <FeatureCard>
                    <FeatureIcon
                      whileHover={{ 
                        scale: 1.1,
                        rotate: 5,
                        transition: { duration: 0.3 }
                      }}
                    >
                      <feature.icon />
                    </FeatureIcon>
                    <FeatureTitle>{feature.title}</FeatureTitle>
                    <FeatureDescription>{feature.description}</FeatureDescription>
                  </FeatureCard>
                </motion.div>
              ))}
            </Grid>
          </motion.div>
        </Container>
      </FeaturesSection>

      <CTASection>
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <CTACard>
              <Title align="center" margin="0 0 20px 0" style={{ color: 'white' }}>
                Ready to Start Your Minecraft Journey?
              </Title>
              <Text align="center" margin="0 0 30px 0" style={{ color: 'rgba(255,255,255,0.9)' }}>
                Join thousands of players who trust MCHostPanel for their Minecraft hosting needs.
              </Text>
              <Button as={Link} to="/register" size="large" style={{ background: 'white', color: theme.colors.primary }}>
                Create Your Server Now <FaArrowRight />
              </Button>
            </CTACard>
          </motion.div>
        </Container>
      </CTASection>
    </>
  );
};

export default Home;