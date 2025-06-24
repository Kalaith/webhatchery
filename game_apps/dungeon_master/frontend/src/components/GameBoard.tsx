import React, { type ReactNode } from 'react';

interface GameBoardProps {
  children: ReactNode;
}

const GameBoard: React.FC<GameBoardProps> = ({ children }) => (
  <div className="flex-1 px-6 py-8 flex flex-col gap-6 max-w-screen-xl mx-auto w-full">
    {children}
  </div>
);

export default GameBoard;
