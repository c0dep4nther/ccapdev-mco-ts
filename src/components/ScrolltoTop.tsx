"use client"

import { Box } from '@mantine/core';
import { Button } from "@/components/ui/Button";
import { useWindowScroll } from '@mantine/hooks';
import React from 'react';
import { useScroll } from "framer-motion"

const ScrollToTop: React.FC = () => {
  const [scroll, scrollTo] = useWindowScroll();
  const controls = useScroll(); // Framer Motion hook to track scroll position

  // Calculate when to show the "Back to Top" button
  const showButton = typeof window !== 'undefined' && scroll.y > window.innerHeight / 2;

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'sticky',
        top: '93%',
        paddingBottom: '1rem',
        opacity: showButton ? 1 : 0, // Set opacity based on showButton
        pointerEvents: showButton ? 'auto' : 'none', // Enable/disable interaction
        transition: 'opacity 0.3s ease', // Smooth fade transition
      }}
    >
      <Button variant="outline" onClick={() => scrollTo({ y: 0 })}>
        Back to Top
      </Button>
    </Box>
  );
};
export default ScrollToTop;