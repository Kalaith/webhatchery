import React from 'react';

interface SkillCategoryButtonProps {
  name: string;
  selected?: boolean;
  onClick: () => void;
}

const SkillCategoryButton: React.FC<SkillCategoryButtonProps> = ({ name, selected, onClick }) => (
  <button
    className={`px-2 py-1 rounded ${selected ? 'bg-purple-500 text-white' : 'bg-gray-200'}`}
    onClick={onClick}
  >
    {name}
  </button>
);

export default SkillCategoryButton;
