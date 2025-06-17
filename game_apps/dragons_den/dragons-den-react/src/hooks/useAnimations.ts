import { useEffect } from 'react';
import { useSpring, animated } from 'react-spring';

export const useAnimations = (trigger: boolean) => {
  const animationProps = useSpring({
    opacity: trigger ? 1 : 0,
    transform: trigger ? 'translateY(0)' : 'translateY(-20px)',
    config: { tension: 200, friction: 15 },
  });

  return animationProps;
};