// components/Loading.tsx
import React from "react";

interface LoadingProps {
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
  message?: string;
  transparent?: boolean; // New prop for different overlay styles
}

const Loading: React.FC<LoadingProps> = ({
  size = "md",
  fullScreen = false,
  message = "Loading...",
  transparent = false,
}) => {
  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-gray-200 border-t-blue-600`}
      />
      {message && (
        <p className="text-gray-600 text-sm font-medium">{message}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 shadow-xl min-w-[200px]">
          {spinner}
        </div>
      </div>
    );
  }

  // Non-fullscreen version (for inline loading)
  if (transparent) {
    return (
      <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default Loading;
