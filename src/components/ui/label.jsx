"use client";

import * as LabelPrimitive from "@radix-ui/react-label";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Label = forwardRef(({ className, required, children, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn("mb-1.5 block text-sm font-medium text-foreground", className)}
    {...props}
  >
    {children}
    {required && <span className="ml-0.5 text-error-600">*</span>}
  </LabelPrimitive.Root>
));
Label.displayName = "Label";
