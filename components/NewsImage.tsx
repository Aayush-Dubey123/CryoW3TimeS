"use client";

import React, { useState, useEffect } from "react";
import Image, { ImageProps } from "next/image";
import { DEFAULT_FALLBACK_IMAGE, normalizeImageUrl } from "@/lib/imageUtils";

interface NewsImageProps extends Omit<ImageProps, "src"> {
  src: string | null | undefined;
  fallbackSrc?: string;
}

export function NewsImage({
  src,
  alt,
  fallbackSrc = DEFAULT_FALLBACK_IMAGE,
  onError,
  className,
  unoptimized,
  ...rest
}: NewsImageProps) {
  const initialSrc = normalizeImageUrl(src);
  const [imgSrc, setImgSrc] = useState<string>(initialSrc);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    const normalized = normalizeImageUrl(src);
    setImgSrc(normalized);
    setHasError(false);
  }, [src]);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (!hasError && imgSrc !== fallbackSrc) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
    if (onError) {
      onError(e);
    }
  };

  const isExternal = typeof imgSrc === "string" && (imgSrc.startsWith("http://") || imgSrc.startsWith("https://"));

  return (
    <Image
      {...rest}
      src={imgSrc}
      alt={alt || "News article image"}
      className={className}
      onError={handleError}
      unoptimized={unoptimized ?? isExternal}
    />
  );
}

export default NewsImage;
