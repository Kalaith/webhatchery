import React, { useRef, useState, useEffect } from 'react';

interface HammerMiniGameProps {
  maxClicks: number;
  onComplete: (accuracy: number) => void;
  craftingStarted: boolean;
}

const TARGET_WIDTH = 60; // px
const CURSOR_WIDTH = 20; // px
const BAR_WIDTH = 300; // px
const BAR_HEIGHT = 24; // px

const HammerMiniGame: React.FC<HammerMiniGameProps> = ({ maxClicks, onComplete, craftingStarted }) => {
  const [clicks, setClicks] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [cursorPos, setCursorPos] = useState(0);
  const [targetPos, setTargetPos] = useState(Math.random() * (BAR_WIDTH - TARGET_WIDTH));
  const [movingRight, setMovingRight] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Animate cursor
  useEffect(() => {
    if (!craftingStarted || clicks >= maxClicks) return;
    intervalRef.current = setInterval(() => {
      setCursorPos(pos => {
        let next = movingRight ? pos + 8 : pos - 8;
        if (next <= 0) {
          setMovingRight(true);
          next = 0;
        } else if (next >= BAR_WIDTH - CURSOR_WIDTH) {
          setMovingRight(false);
          next = BAR_WIDTH - CURSOR_WIDTH;
        }
        return next;
      });
    }, 24);
    return () => clearInterval(intervalRef.current!);
  }, [craftingStarted, clicks, movingRight, maxClicks]);

  // Reset on start
  useEffect(() => {
    if (craftingStarted) {
      setClicks(0);
      setAccuracy(0);
      setCursorPos(0);
      setTargetPos(Math.random() * (BAR_WIDTH - TARGET_WIDTH));
      setMovingRight(true);
    }
  }, [craftingStarted]);

  const handleHammerClick = () => {
    if (clicks >= maxClicks) return;
    // Check if cursor is in target zone
    const cursorCenter = cursorPos + CURSOR_WIDTH / 2;
    const targetStart = targetPos;
    const targetEnd = targetPos + TARGET_WIDTH;
    let hit = cursorCenter >= targetStart && cursorCenter <= targetEnd;
    setAccuracy(acc => acc + (hit ? 25 : 0));
    setClicks(c => c + 1);
    setTargetPos(Math.random() * (BAR_WIDTH - TARGET_WIDTH));
    if (clicks + 1 === maxClicks) {
      setTimeout(() => onComplete(accuracy + (hit ? 25 : 0)), 500);
    }
  };

  return (
    <div className="hammer-mini-game">
      <h4>Hammer Mini-game</h4>
      <div style={{ marginBottom: 8 }}>Hits: {clicks} / {maxClicks}</div>
      <div>Accuracy: {accuracy}%</div>
      <div style={{ position: 'relative', width: BAR_WIDTH, height: BAR_HEIGHT, background: '#eee', borderRadius: 8, margin: '16px 0' }}>
        <div style={{ position: 'absolute', left: targetPos, top: 0, width: TARGET_WIDTH, height: BAR_HEIGHT, background: 'var(--color-success)', opacity: 0.5, borderRadius: 8 }} />
        <div style={{ position: 'absolute', left: cursorPos, top: 0, width: CURSOR_WIDTH, height: BAR_HEIGHT, background: 'var(--color-primary)', borderRadius: 8, boxShadow: '0 0 4px #333' }} />
      </div>
      <button className="btn btn--primary" onClick={handleHammerClick} disabled={clicks >= maxClicks}>⚒️ HAMMER!</button>
    </div>
  );
};

export default HammerMiniGame;
