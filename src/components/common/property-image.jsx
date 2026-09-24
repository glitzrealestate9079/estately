"use client";

import Image from "next/image";
import { Building2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function PropertyImage({ src, alt, className, sizes = "(min-width: 1024px) 25vw, 100vw", fill = true, ...props }) {
  const [errored, setErrored] = useState(false);

  if (!src || errored) {
    return (
      <div
        className={cn(
          "absolute inset-0 flex h-full w-full items-center justify-center bg-gradient-to-br from-navy-100 to-navy-200 text-navy-400 dark:from-navy-800 dark:to-navy-900 dark:text-navy-600",
          className
        )}
      >
        <Building2 className="h-8 w-8" />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      sizes={sizes}
      className={cn("object-cover", className)}
      onError={() => setErrored(true)}
      {...props}
    />
  );
}
