import { useEffect, useRef } from "react";
import type { GridCell } from "./DungeonGrid";
import { adventurerClasses } from "../../data/gameData";

export interface Adventurer {
  id: number;
  classIdx: number;
  x: number;
  y: number;
  hp: number;
  alive: boolean;
}

export interface AdventurerPhaseProps {
  grid: GridCell[][];
  running: boolean;
  onEnd: (log: { message: string; type: string }[]) => void;
  addLog: (entry: { message: string; type: string }) => void;
  onUpdate?: (adventurers: Adventurer[]) => void;
}

export const AdventurerPhase: React.FC<AdventurerPhaseProps> = ({ grid, running, onEnd, addLog, onUpdate }) => {
  const adventurers = useRef<Adventurer[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const path = useRef<{ x: number; y: number }[]>([]);
  const logBuffer = useRef<{ message: string; type: string }[]>([]);

  // Find a simple path from entrance to exit (straight line for now)
  useEffect(() => {
    if (!running) return;
    // Find entrance and exit
    let entrance, exit;
    for (let row of grid) {
      for (let cell of row) {
        if (cell.isEntrance) entrance = { x: cell.x, y: cell.y };
        if (cell.isExit) exit = { x: cell.x, y: cell.y };
      }
    }
    if (!entrance || !exit) return;
    // Simple straight path (for now)
    const p: { x: number; y: number }[] = [];
    let x = entrance.x, y = entrance.y;
    while (x !== exit.x || y !== exit.y) {
      p.push({ x, y });
      if (x < exit.x) x++;
      else if (x > exit.x) x--;
      else if (y < exit.y) y++;
      else if (y > exit.y) y--;
    }
    p.push({ x: exit.x, y: exit.y });
    path.current = p;
    // Spawn adventurers
    adventurers.current = Array.from({ length: 3 }, (_, i) => {
      const cls = Math.floor(Math.random() * adventurerClasses.length);
      return {
        id: i,
        classIdx: cls,
        x: entrance.x,
        y: entrance.y,
        hp: adventurerClasses[cls].hp,
        alive: true,
      };
    });
    logBuffer.current = [{ message: "Adventurers have entered the dungeon!", type: "system" }];
    let step = 0;
    if (onUpdate) onUpdate(adventurers.current.map(a => ({ ...a })));
    intervalRef.current = setInterval(() => {
      if (step >= path.current.length) {
        clearInterval(intervalRef.current!);
        onEnd([...logBuffer.current, { message: "Adventurers reached the exit!", type: "system" }]);
        return;
      }
      // Move all alive adventurers
      for (let adv of adventurers.current) {
        if (!adv.alive) continue;
        adv.x = path.current[step].x;
        adv.y = path.current[step].y;
        // Check for monsters in this cell
        const cell = grid[adv.y][adv.x];
        if (cell.monsters.length > 0) {
          adv.hp -= 5 * cell.monsters.length; // Simple damage model
          logBuffer.current.push({ message: `Adventurer ${adv.id + 1} fought monsters and lost ${5 * cell.monsters.length} HP!`, type: "combat" });
          if (adv.hp <= 0) {
            adv.alive = false;
            logBuffer.current.push({ message: `Adventurer ${adv.id + 1} died!`, type: "combat" });
          }
        }
        // Check for trap (Trap Hallway roomType)
        if (cell.roomType !== null && cell.roomType === 2) {
          adv.hp -= 7;
          logBuffer.current.push({ message: `Adventurer ${adv.id + 1} triggered a trap and lost 7 HP!`, type: "combat" });
          if (adv.hp <= 0) {
            adv.alive = false;
            logBuffer.current.push({ message: `Adventurer ${adv.id + 1} died to a trap!`, type: "combat" });
          }
        }
      }
      if (onUpdate) onUpdate(adventurers.current.map(a => ({ ...a })));
      step++;
    }, 800);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    // Only re-run when running or grid changes, not on onEnd/onUpdate
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, grid]);

  return null;
};
