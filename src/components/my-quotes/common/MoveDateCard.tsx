import React from "react";

interface MoveDateCardProps {
  category: string;
  text: string;
}

const MoveDateCard = ({ category, text }: MoveDateCardProps) => {
  return (
    <div className="flex items-center gap-2">
      <div className="px-1.5 bg-bg-400 rounded">
        <p className="text-14-medium text-gray-400">{category}</p>
      </div>
      <p className="text-14-medium">{text}</p>
    </div>
  );
};

export default MoveDateCard;
