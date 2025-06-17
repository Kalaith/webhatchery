import React from 'react';
import styled from 'styled-components';

const ProgressBarContainer = styled.div`
  width: 100%;
  background-color: var(--color-border);
  border-radius: 8px;
  overflow: hidden;
`;

const Progress = styled.div<{ progress: number }>`
  height: 100%;
  width: ${({ progress }) => progress}%;
  background-color: var(--color-primary);
  transition: width 0.3s ease;
`;

interface ProgressBarProps {
  value: number;
  max: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value, max }) => {
  const progress = Math.min((value / max) * 100, 100);

  return (
    <ProgressBarContainer>
      <Progress progress={progress} />
    </ProgressBarContainer>
  );
};

export default ProgressBar;