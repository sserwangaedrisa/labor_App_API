import * as React from "react";
import { cn } from "../../../lib/utils";

type ImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  src?: string;
  fallbackSrc?: string;
  aspectRatio?: string;
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
};

const DEFAULT_FALLBACK_IMAGE = "/images/placeholder.png";

const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  (
    {
      src,
      alt = "",
      className,
      style,
      fallbackSrc = DEFAULT_FALLBACK_IMAGE,
      aspectRatio,
      objectFit = "cover",
      onError,
      ...props
    },
    ref,
  ) => {
    const [imageSrc, setImageSrc] = React.useState<string>(src || fallbackSrc);

    const [hasError, setHasError] = React.useState(false);

    React.useEffect(() => {
      setImageSrc(src || fallbackSrc);
      setHasError(false);
    }, [src, fallbackSrc]);

    const handleError = (
      event: React.SyntheticEvent<HTMLImageElement, Event>,
    ) => {
      // Prevent an infinite loop if the fallback itself is broken.
      if (!hasError && imageSrc !== fallbackSrc) {
        setHasError(true);
        setImageSrc(fallbackSrc);
      }

      onError?.(event);
    };

    return (
      <img
        ref={ref}
        src={imageSrc}
        alt={alt}
        className={cn("block", className)}
        style={{
          aspectRatio,
          objectFit,
          ...style,
        }}
        onError={handleError}
        {...props}
      />
    );
  },
);

Image.displayName = "Image";

export { Image };
