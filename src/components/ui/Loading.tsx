import React from "react";

interface LoadingProps {
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
  message?: string;
  transparent?: boolean;
  overlay?: boolean;
  zIndex?: string;
}

const Loading: React.FC<LoadingProps> = ({
  size = "md",
  fullScreen = false,
  message = "Loading...",
  transparent = false,
  overlay = true,
  zIndex = "z-50",
}) => {
  const sizeClasses = {
    sm: "w-5 h-5 border-2",
    md: "w-8 h-8 border-4",
    lg: "w-12 h-12 border-4",
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-gray-200 border-t-blue-600`}
      />
      {message && (
        <p className="text-gray-600 text-sm font-medium">{message}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div
        className={`fixed inset-0 ${overlay ? "bg-black bg-opacity-50 backdrop-blur-sm" : ""} flex items-center justify-center ${zIndex}`}
      >
        <div className="bg-white rounded-lg p-6 shadow-xl min-w-[200px]">
          {spinner}
        </div>
      </div>
    );
  }

  if (transparent) {
    return (
      <div
        className={`absolute inset-0 ${overlay ? "bg-white bg-opacity-75 backdrop-blur-[2px]" : ""} flex items-center justify-center ${zIndex}`}
        style={{ pointerEvents: "auto" }}
      >
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default Loading;
