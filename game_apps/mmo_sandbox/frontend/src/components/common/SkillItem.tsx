import React from 'react';

interface SkillItemProps {
  name: string;
  level: number;
  onClick?: () => void;
}

const SkillItem: React.FC<SkillItemProps> = ({ name, level, onClick }) => (
  <div className="flex items-center gap-2 p-2 border rounded cursor-pointer" onClick={onClick}>
    <span className="font-bold">{name}</span>
    <span className="text-xs text-gray-500">Lv.{level}</span>
  </div>
);

export default SkillItem;
