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
        className={`controller cursor-pointer py-2 px-20 transition ease-in-out duration-300 
          ${isActive 
            ? "bg-secondaryColor text-primaryButtonHoverColor" 
            : "bg-primaryColor text-white"}` 
        }
      >
        {textContent}
      </button>
    </div>
  );
};

export default PannelSelector;
