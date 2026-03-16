import React, { useState } from "react";

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  alt?: string;
  className?: string;
}

const Image: React.FC<ImageProps> = ({
  src,
  alt = "Image Name",
  className = "",
  ...props
}) => {
  const [open, setOpen] = useState(false);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = "../../assets/hero.png";
  };

  const openPreview = () => setOpen(true);
  const closePreview = () => setOpen(false);

  return (
    <>
      <img
        src={src}
        alt={alt}
        className={`cursor-pointer ${className}`}
        onError={handleError}
        onClick={openPreview}
        {...props}
      />

      {/* Fullscreen Preview */}
      {open && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[1000]"
          onClick={closePreview}
        >
          <img
            src={src}
            alt={alt}
            onClick={(e) => e.stopPropagation()}
            className="max-w-[90%] max-h-[90%] object-contain rounded-lg shadow-2xl"
          />

          <button
            onClick={closePreview}
            className="absolute top-6 right-6 text-white text-3xl font-bold hover:text-gray-300"
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
};

export default Image;
