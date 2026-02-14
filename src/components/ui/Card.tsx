import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

const Card = ({ children, className = "" }: CardProps) => {
  return (
    <div className={`bg-white shadow rounded p-4 ${className}`}>
      {children}
    </div>
  );
};

export default Card;
