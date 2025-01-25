"use client";

import "./style.css";

interface PannelSelectorProps {
  textContent: string;
  onClick: () => void;
  className?: string;
}

const PannelSelector: React.FC<PannelSelectorProps> = ({ textContent, onClick, className }) => {
  return (
    <div className="w-full">
      <button
        onClick={onClick}
        type="button"
        className={`controller cursor-pointer py-2 px-16 text-white transition ease-in-out duration-300 ${className}`}
      >
        {textContent}
      </button>
    </div>
  );
};

export default PannelSelector;
