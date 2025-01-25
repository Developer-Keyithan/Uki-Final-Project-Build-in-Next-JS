import { useState } from "react";

interface PannelSelectorProps {
  textContent: string;
  onClick: () => void;
  isActive: boolean; 
}

const PannelSelector: React.FC<PannelSelectorProps> = ({ textContent, onClick, isActive }) => {
  return (
    <div>
      <button
        onClick={onClick}
        type="button"
        className={`controller cursor-pointer py-2 px-20 text-white transition ease-in-out duration-300 
          ${isActive 
            ? "bg-white text-black" 
            : "bg-primary-color text-white"}` 
        }
      >
        {textContent}
      </button>
    </div>
  );
};

export default PannelSelector;
